# Generated by Django 4.0.6 on 2022-09-19 03:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musgame', '0013_alter_game_js_content'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='css_content',
            field=models.FileField(blank=True, upload_to='musgame/static/musgame/game_css'),
        ),
    ]
