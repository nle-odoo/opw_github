// ==UserScript== //
// @name opw_github
// @match *://github.com/odoo/*
// @match *://github.com/odoo-dev/*
// ==/UserScript==

function insertAfter(new_node, ref_node) {
  ref_node.parentNode.insertBefore(new_node, ref_node.nextSibling);
}
function treat(node) {
  switch(node.nodeType) {
    case 3:
      break;
    case 1:
      node.childNodes.forEach(treat);
    default:
      return;
  }
  var oval = node.nodeValue;
  if (!/opw|task/i.test(oval)) {
    return;
  }
  var done_offset = 0;
  oval.replace(/\b((?:opw|task)(?: id)?[: #-] ?)(\d{5,})\b/gi, function(match, prefix, num, offset) {
    var link = document.createElement("a");
    num = prefix[0].toLowerCase() == 'o' && num < 1E6 ? 1E6 + +num : num;
    link.setAttribute("href", "https://www.odoo.com/web#id=" + num + "&view_type=form&model=project.task");
    link.appendChild(document.createTextNode(num));
    node.nodeValue = oval.slice(done_offset, offset + prefix.length);
    done_offset = offset + match.length;
    insertAfter(link, node);
    node = document.createTextNode(oval.slice(done_offset));
    insertAfter(node, link);
  });
}
const treat_all = () => {document.querySelectorAll(".comment-body:not([data-opw-handled]),.commit-desc:not([data-opw-handled])").forEach(n => {n.setAttribute('data-opw-handled', 1);treat(n)})};
treat_all();
window.addEventListener('pjax:end', treat_all);
