"""
WSGI config for dehweb project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "dehweb.settings")

application = get_wsgi_application()

#sys.path.append('E:/github/DEH_website/dehweb/')
#sys.path.append('E:/github/DEH_website/')
