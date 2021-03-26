export const getTodaysDate = () => {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}

export const requestDay = () => {
  let due = new Date();
  due.setDate(due.getDate() + 3)
  const dd = String(due.getDate()).padStart(2, '0');;
  const mm = String(due.getMonth() + 1).padStart(2, '0');;
  const yyyy = due.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}