import swal from 'sweetalert';

export const myAlert = (title, text, icon) => {
  swal({
    title: title,
    text: text,
    icon: icon,
    button: "Ok"
  });
}