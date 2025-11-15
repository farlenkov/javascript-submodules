import showdown from 'showdown'; 

// https://github.com/showdownjs/showdown

const showdownConverter = new showdown.Converter
({
    tables : true,
    tasklists : true
});

export function mdToHtml(markdown, replaceNewline)
{
    if (replaceNewline)
        markdown = markdown.replace(/\n/g, "<br>");
    
    return showdownConverter.makeHtml(markdown);
    // const html = showdownConverter.makeHtml(markdown);
    // return replaceNewline ? html.replace(/\n/g, "<br>") : html;
}