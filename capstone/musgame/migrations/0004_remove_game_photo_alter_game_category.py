# Generated by Django 4.0.6 on 2022-09-15 21:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musgame', '0003_game_category_game_photo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='photo',
        ),
        migrations.AlterField(
            model_name='game',
            name='category',
            field=models.CharField(choices=[('CS', 'Classical'), ('JZ', 'Jazz')], default='CS', max_length=2),
        ),
    ]
