# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-12-20 07:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bims', '0089_auto_20181219_0829'),
    ]

    operations = [
        migrations.CreateModel(
            name='VernacularName',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('source', models.CharField(blank=True, max_length=250, null=True)),
                ('language', models.CharField(blank=True, max_length=50, null=True)),
                ('taxon_key', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='taxonomy',
            name='vernacular_names',
        ),
        migrations.AddField(
            model_name='taxonomy',
            name='vernacular_names',
            field=models.ManyToManyField(blank=True, null=True, to='bims.VernacularName'),
        ),
    ]