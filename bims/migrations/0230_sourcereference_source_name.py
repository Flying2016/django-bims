# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-03-20 13:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bims', '0229_nonbiodiversitylayer_get_feature_format'),
    ]

    operations = [
        migrations.AddField(
            model_name='sourcereference',
            name='source_name',
            field=models.CharField(blank=True, default=b'', max_length=512),
        ),
    ]