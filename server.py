#!/usr/bin/env python

# Make sure you `pip install websockets` first

import asyncio
import websockets
import time
import random

STIM_INTERVAL = 0.80 #secs between stimulations

async def log_message(message):
    print(f"Server received: {message}")

async def stim_single_phosphene():
    return '[{"id":10001,"int":1}]'

async def stim_random_phosphene():
    return f'[{{"id":{random.randint(10001, 10008)},"int":1}}]'

async def inbound_message_handler(websocket, path):
    async for message in websocket:
        await log_message(message)

async def outbound_payload_handler(websocket, path):
    while True:
        time.sleep(STIM_INTERVAL) # delay inbetween emitting next event
        #message = await stim_single_phosphene()
        message = await stim_random_phosphene()
        await websocket.send(message)


async def run_loop(websocket, path):
    print("Client connected")
    inbound_task = asyncio.ensure_future(inbound_message_handler(websocket, path)) # There's still a bug that means this doesn't fire. It's an async issue with the way i've done it in Py
    outbound_task = asyncio.ensure_future(outbound_payload_handler(websocket, path))
    done, pending = await asyncio.wait(
        [inbound_task, outbound_task],
        return_when = asyncio.FIRST_COMPLETED
    )
    for task in pending:
        task.cancel()  # Alternatively, can we just call run_loop again?
    
    run_loop(websocket, path)

start_server = websockets.serve(run_loop, "192.168.99.222", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()