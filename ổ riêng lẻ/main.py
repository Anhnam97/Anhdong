from telethon.sync import TelegramClient

api_id = '20631255'
api_hash = 'c0ce0d24c3a6a653b1aaaad41df9928c'

# Create a Telethon client instance
client = TelegramClient('tepy_session', api_id, api_hash)
client.start()

async def send_message_to_group(grpName, msg):
    # Get the group
    group_entity = await client.get_input_entity(grpName)

    # Send message to group
    await client.send_message(group_entity, msg)

# Run the send_message_to_group coroutine
with client:
    client.loop.run_until_complete(send_message_to_group('testnhom21', 'Hello from telethon!'))
    print('============ Finish ============')