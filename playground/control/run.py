# -*- coding: utf-8 -*-

import os

from playground.control.runner import PlaygroundRunner


CORS_ALLOWED = os.environ.get("CORS_ALLOWED", '')
PLAYGROUND_ENV = os.environ.get("PLAYGROUND_ENV", 'production')
# todo: think how to make this work with multiple paths
PLAYGROUND_SERVICES = (
    (os.environ['PLAYGROUND_SERVICES'], )
    if os.environ.get('PLAYGROUND_SERVICES')
    else ('/services', ))


ENDPOINTS = (
    ("/resources", "dump_resources"),
    ("/events", "events"),
    ("/clear", "clear"),
    ("/network/add", "network_add", "POST"),
    ("/network/edit", "network_edit", "POST"),
    ("/network/delete", "network_delete", "POST"),
    ("/proxy/add", "proxy_add", "POST"),
    ("/proxy/delete", "proxy_delete", "POST"),
    ("/service/add", "service_add", "POST"),
    ("/service/delete", "service_delete", "POST"))


def main() -> None:
    PlaygroundRunner(
        ENDPOINTS,
        CORS_ALLOWED,
        PLAYGROUND_ENV,
        PLAYGROUND_SERVICES).run()
