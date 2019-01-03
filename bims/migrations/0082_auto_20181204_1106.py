# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-12-04 11:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bims', '0081_auto_20181205_0255'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='biologicalcollectionrecord',
            name=b'taxon_gbif_id',
        ),
        migrations.AlterField(
            model_name='taxonomy',
            name='rank',
            field=models.CharField(blank=True, choices=[(b'CLASS', b'Class'), (b'DOMAIN', b'Domain'), (b'FAMILY', b'Family'), (b'GENUS', b'Genus'), (b'KINGDOM', b'Kingdom'), (b'LIFE', b'Life'), (b'ORDER', b'Order'), (b'PHYLUM', b'Phylum'), (b'SPECIES', b'Species'), (b'SUBSPECIES', b'Sub Species')], max_length=50, verbose_name=b'Taxonomic Rank'),
        ),
    ]