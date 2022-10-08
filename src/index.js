function component() {
  const element = document.createElement('div');
  element.innerHTML = 'Hello World!';
  return element
}

document.getElementById('root').appendChild(component());
