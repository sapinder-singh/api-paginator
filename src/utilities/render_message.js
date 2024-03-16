function RenderMessageToClient(res, { error, success }) {
  if (error) {
    res.status(error.errorCode).render('index', { error, success: false });
    return;
  }
  if (success) {
    res.status(success.successCode).render('index', { success, error: false });
  }
}

export default RenderMessageToClient;
