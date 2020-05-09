$(document).ready(function () {

    // Prevent default event action
    function preventDefaultAction(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }

    function Section() {
        this.title = "";
        this.items = [];
    }

    const md = window.markdownit();
    let sections = [];
    let curSection = 0;

    const $markdownInput = $("#markdownInput");
    const $sectionNav = $("#sectionNav");
    const $renderedContent = $("#renderedContent");
    const $prevButton = $("#prevButton");
    const $nextButton = $("#nextButton");

    function setCurSection() {
        const hash = window.location.hash.slice(1);
        curSection = Number(hash) || 0;
    }

    function updateSections() {
        sections = [];

        const parsed = md.parse($markdownInput.val(), {});

        let headingOpen = false;
        let sectionOpen = false;
        let section = new Section();

        parsed.forEach(function (item, index) {
            if (item.type === "heading_open" && item.tag === "h1") {
                if (sectionOpen) {
                    sections.push(section);
                }
                section = new Section();
                headingOpen = true;
                sectionOpen = true;
            }

            if (headingOpen && item.type === "inline" && item.tag === "") {
                section.title = item.content;
            }

            if (item.type === "heading_close" && item.tag === "h1") {
                headingOpen = false;
            }

            section.items.push(item);
        });

        if (sectionOpen) {
            sections.push(section);
        }

        if (curSection > sections.length - 1) {
            curSection = sections.length - 1;
        }
    }

    function updateSectionNav() {
        $sectionNav.html("");
        sections.forEach(function (section, idx) {
            let elem = section.title;
            if (idx !== curSection) {
                elem = '<a href="#' + idx + '">' + elem + '</a>';
            }
            $sectionNav.append('<li class="h6 my-4">' + elem + '</li>')
        });
    }

    function updateRenderedContent() {
        $renderedContent.html(md.renderer.render(sections[curSection].items, {}, {}));
    }

    function updateAll() {
        setCurSection();
        updateSections();
        updateSectionNav();
        updateRenderedContent();
    }

    $prevButton.click(function () {
        if (curSection > 0) {
            window.location.hash = '#' + (curSection - 1);
        }
    });

    $nextButton.click(function () {
        if (curSection < sections.length - 1) {
            window.location.hash = '#' + (curSection + 1);
        }
    });

    $(window).bind('hashchange', function () {
        updateAll();
    });

    $markdownInput.on("keyup paste", function () {
        updateAll();
    });

    updateAll();
});