function makeResponse(
  text,
  tts,
  end_session,
  session,
  version,
  session_state = {},
  commands = []
) {
  return {
    response: {
      text,
      tts,
      end_session,
      commands,
    },
    session,
    version,
    session_state,
  };
}

export { makeResponse };
