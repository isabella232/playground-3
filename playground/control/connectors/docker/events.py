
import asyncio
from typing import AsyncGenerator


class PlaygroundDockerEvents(object):

    def __init__(self, docker):
        self.docker = docker

    async def __call__(self) -> AsyncGenerator[dict, None]:
        subscriber = self.docker.events.subscribe()
        while True:
            yield await subscriber.get()

    async def emit(self, publisher: dict, debug=None) -> None:
        async for event in self():
            event_type = event['Type']
            event_action = event['Action']
            if debug:
                print(f">>> EVENT ({event_type}:{event_action})")
            if debug and event_type in (debug or []):
                print(f">>> EVENT ({event_type})")
                print(event)
                print()
            if publisher.get(event['Type']):
                await publisher[event['Type']](event)

    def subscribe(self, name: str, publisher: dict, debug=None) -> None:
        asyncio.create_task(
            self.emit(publisher, debug=debug),
            name=name)

    async def unsubscribe(self, name: str) -> None:
        for task in asyncio.Task.all_tasks():
            if task.get_name() != name:
                continue
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                print("task is cancelled now")
            else:
                print("Error stopping task")