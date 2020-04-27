const rules = document.getElementById("rules");
const SingleTab = document.getElementById("SingleTab");
const MultiTab = document.getElementById("MultiTab");
function OpenRulesTab() {
  rules.style = "display:flex;";
}
function CloseRuleTabe() {
  rules.style = "display:none;";
}

function OpenSingleTab() {
  SingleTab.style = "display:flex;";
}
function CloseSingleTab() {
  SingleTab.style = "display:none;";
}

function OpenMultiTab() {
  MultiTab.style = "display:flex;";
}
function CloseMultiTab() {
  MultiTab.style = "display:none;";
}
