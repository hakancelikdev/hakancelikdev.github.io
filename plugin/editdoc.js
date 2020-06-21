const plugin = (hook, vm) => {
    hook.beforeEach(function (html) {
        let editDoc = window.$docsify.editDoc;
        let url = `https://github.com/${editDoc.username}/${editDoc.repoName}/tree/${editDoc.branch}/${editDoc.docsPath}/${vm.route.file}`;
        let editHtml = '[📝 EDIT DOCUMENT](' + url + ')\n';
        return (editHtml + html);
    });
}
window.$docsify.plugins = [].concat(plugin, window.$docsify.plugins)
