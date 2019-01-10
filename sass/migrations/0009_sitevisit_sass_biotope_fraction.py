# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-01-09 13:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sass', '0008_sassbiotopefraction'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitevisit',
            name='sass_biotope_fraction',
            field=models.ManyToManyField(blank=True, null=True, to='sass.SassBiotopeFraction'),
        ),
    ]