# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-01-09 03:49
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bims', '0096_locationsite_river'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='data',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=b'', null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='fbis_username',
            field=models.CharField(blank=True, default=b'', max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='other',
            field=models.CharField(blank=True, default=b'', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='qualifications',
            field=models.CharField(blank=True, default=b'', max_length=250, null=True),
        ),
    ]
