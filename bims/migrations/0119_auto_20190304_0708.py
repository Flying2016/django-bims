# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-03-04 07:08
from __future__ import unicode_literals

import uuid
from django.db import migrations


def gen_uuid(apps, schema_editor):
    BiologicalCollectionRecord = (
        apps.get_model('bims', 'BiologicalCollectionRecord')
    )
    for row in BiologicalCollectionRecord.objects.filter(uuid__isnull=True):
        row.uuid = uuid.uuid4()
        row.save()


class Migration(migrations.Migration):

    dependencies = [
        ('bims', '0118_auto_20190304_0701'),
    ]

    operations = [
    ]