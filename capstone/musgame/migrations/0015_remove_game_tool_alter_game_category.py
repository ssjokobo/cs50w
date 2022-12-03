# Generated by Django 4.0.6 on 2022-09-22 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musgame', '0014_game_css_content'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='tool',
        ),
        migrations.AlterField(
            model_name='game',
            name='category',
            field=models.CharField(choices=[('CS', 'Classical'), ('JZ', 'Jazz'), ('TL', 'Tool')], default='CS', max_length=2),
        ),
    ]
