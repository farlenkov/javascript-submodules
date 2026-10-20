import { Menu } from "obsidian";

// https://docs.obsidian.md/Reference/TypeScript+API/Menu
// https://docs.obsidian.md/Reference/TypeScript+API/MenuItem

export function attachHoverMenu(
    el, 
    getContextItems, 
    openDelay = 50, 
    closeDelay = 200) 
{
    let menu = null;
    let openTimer = null;
    let closeTimer = null;
    let openOnClick = false;

    const cancelClose = () => clearTimeout(closeTimer);
    const cancelOpen = () => clearTimeout(openTimer);

    const close = () => 
    {
        cancelOpen();
        cancelClose();
        menu?.hide();
    };

    const scheduleClose = () => 
    {
        cancelOpen();
        cancelClose();
        closeTimer = setTimeout(close, closeDelay);
    };

    const open = () => 
    {
        if (menu) 
            return;

        const items = getContextItems();
        const rect = el.getBoundingClientRect();

        items[0].pos = 
        { 
            x : rect.left + rect.width / 2, 
            y : rect.bottom 
        };

        menu = showContextMenu(items);
        menu.onHide(() => { menu = null; });

        menu.dom.addEventListener("mouseenter", cancelClose);
        menu.dom.addEventListener("mouseleave", scheduleClose);
    };

    const onDown = () => 
    {
        openOnClick = menu ? false : true;
    };

    const onClick = () => 
    {
        if (openOnClick)
            onEnter();
    };

    const onEnter = () => 
    {
        cancelClose();
        cancelOpen();
        openTimer = setTimeout(open, openDelay);
    };

    el.addEventListener("click",      onClick);
    el.addEventListener("mousedown",  onDown);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", scheduleClose);

    return () => 
    {
        close();
        el.removeEventListener("click",      onClick);
        el.removeEventListener("mousedown",  onDown);
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", scheduleClose);
    };
}

export function showContextMenu(...args) 
{
    if (args.length === 1)
        args = args[0];

    const opts = args[0];
    const menu = new Menu(opts.app);

    for (let i = 1; i < args.length; i++)
    {
        const item = args[i];

        if (!item)
        {
            menu.addSeparator();
            continue;
        }

        menu.addItem(el => 
        {
            if (item.title)     el.setTitle(item.title);
            if (item.icon)      el.setIcon(item.icon);
            if (item.warning)   el.setWarning(true);
            if (item.disabled)  el.setDisabled(true);
            if (item.checked)   el.setChecked(true);
            if (item.class)     addClass(el.dom, item.class);
            if (item.accent)    addClass(el.dom, 'is-accent');
            if (item.underline) addClass(el.dom, 'underline');
            if (item.dim)       addClass(el.dom, 'dim75');
            if (item.label)     el.dom.setAttribute('aria-label', item.label); 

            if (item.onclick)
                el.onClick(item.onclick);
            else
                el.setIsLabel(true);
        });
    }

    if (opts.class)
        addClass(menu.dom, opts.class);

    if (opts.event)
    {
        opts.event.preventDefault();
        opts.event.stopPropagation();
        menu.showAtMouseEvent(opts.event);
    }
    else if (opts.pos)
    {
        menu.showAtPosition(opts.pos);
    }

    return menu;
}

function addClass(el, classNames)
{
    classNames = classNames.trim().split(/\s+/);
    el.addClass(...classNames);        
}