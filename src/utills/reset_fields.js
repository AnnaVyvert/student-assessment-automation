export function resetFields(ref, findAttribute, removeClass) {
  if (ref.current !== undefined)
    [...ref.current.querySelectorAll(findAttribute)].map((elem) => {
      elem.classList.remove(...removeClass);
      elem.value = '';
      return null;
    });
  else return console.log('resetFields: ref is undefined');
}
