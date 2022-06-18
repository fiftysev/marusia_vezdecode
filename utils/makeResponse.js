function makeResponse(
  text,
  tts,
  end_session,
  session,
  version,
  session_state = {}
) {
  return {
    response: {
      text,
      tts,
      end_session,
    },
    session,
    version,
    session_state,
  };
}

export { makeResponse };
