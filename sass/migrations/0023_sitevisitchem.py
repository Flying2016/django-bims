# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-01-15 02:12
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sass', '0022_chem'),
    ]

    operations = [
        migrations.CreateModel(
            name='SiteVisitChem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chem_value', models.FloatField(blank=True, null=True)),
                ('comment', models.CharField(blank=True, max_length=255, null=True)),
                ('max_detectable_limit', models.IntegerField(blank=True, null=True)),
                ('chem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sass.Chem')),
                ('site_visit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sass.SiteVisit')),
            ],
        ),
    ]