# Generated by Django 4.0.6 on 2022-09-16 00:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musgame', '0006_alter_game_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='photo',
            field=models.ImageField(blank=True, upload_to='musgame/static/musgame/media'),
        ),
    ]
