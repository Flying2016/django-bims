# coding=utf-8
"""Taxa uploader view
"""

from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect, Http404
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from bims.models.taxa_upload_session import TaxaUploadSession
from bims.models.taxon_group import TaxonGroup
from bims.tasks.taxa_upload import taxa_upload


class TaxaUploadView(UserPassesTestMixin, LoginRequiredMixin, TemplateView):
    """Taxa upload view."""
    template_name = 'taxa_uploader.html'

    def test_func(self):
        return self.request.user.has_perm('bims.can_upload_taxa')

    def get_context_data(self, **kwargs):
        context = super(TaxaUploadView, self).get_context_data(**kwargs)
        taxa_upload_sessions = TaxaUploadSession.objects.filter(
            uploader=self.request.user,
            processed=False,
            process_file__isnull=False
        )
        context['upload_sessions'] = taxa_upload_sessions
        context['finished_sessions'] = TaxaUploadSession.objects.filter(
            uploader=self.request.user,
            processed=True
        ).order_by(
            '-uploaded_at'
        )
        context['taxa_groups'] = TaxonGroup.objects.filter(
            category='SPECIES_MODULE'
        ).order_by('display_order')
        return context

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES.get('csv_file')
        taxon_group_id = request.POST.get('taxon_group', None)
        taxon_group_logo = request.FILES.get('taxon_group_logo')
        taxon_group_name = request.POST.get('taxon_group_name', '')
        if taxon_group_logo and taxon_group_logo:
            taxon_groups = TaxonGroup.objects.filter(
                category='SPECIES_MODULE'
            ).order_by('-display_order')
            display_order = 1
            if taxon_groups:
                display_order = taxon_groups[0].display_order + 1
            TaxonGroup.objects.create(
                name=taxon_group_name,
                logo=taxon_group_logo,
                category='SPECIES_MODULE',
                display_order=display_order
            )
            return HttpResponseRedirect('/upload-taxa')
        if not csv_file:
            raise Http404('Missing csv file')
        taxa_upload_session = TaxaUploadSession.objects.create(
            uploader=request.user,
            process_file=csv_file,
            uploaded_at=datetime.now(),
            module_group_id=taxon_group_id
        )
        taxa_upload.delay(taxa_upload_session.id)
        return HttpResponseRedirect('/upload-taxa')


class TaxaUploadStatusApiView(APIView):
    """
    Return status of the taxa upload
    """

    def get(self, request, session_id, *args):
        try:
            session = TaxaUploadSession.objects.get(
                id=session_id
            )
        except TaxaUploadSession.DoesNotExist:
            raise Http404('No session found')
        return Response({
            'token': session.token,
            'progress': session.progress,
            'processed': session.processed
        })
