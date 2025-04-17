import Toast from 'react-bootstrap/Toast';
import 'bootstrap/dist/css/bootstrap.min.css';

function RouterToast({message, type}) {
  return (
    <Toast bg={type}>
      <Toast.Header>
        <img src="../images/logo.png" className="rounded me-2" alt="" />
        <strong className="me-auto">Router</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}

export default RouterToast;