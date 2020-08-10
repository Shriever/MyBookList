module.exports = (template, book) => {
  console.log(book);
  let output = template.replace(/{%TITLE%}/g, book.title);
  output = output.replace(/{%AUTHOR%}/g, book.authors[0]);
  output = output.replace(/{%DESCRIPTION%}/g, book.description);
  output = output.replace(/{%PAGECOUNT%}/g, book.pageCount);

  return output;
};
