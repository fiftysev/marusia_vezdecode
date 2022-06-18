function makeResponse(
  text,
  tts,
  end_session,
  session,
  version,
  session_state = {},
  card = {}
) {
  return {
    response: {
      text,
      tts,
      end_session,
    },
    card,
    session,
    version,
    session_state,
  };
}

export { makeResponse };
