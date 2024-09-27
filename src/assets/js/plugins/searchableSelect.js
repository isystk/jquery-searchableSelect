(function() {

    // 検索機能付きセレクトボックス
    $.fn.searchableSelect = function(options){
        const defaults = {
            searchBoxClass: undefined,
            placeholder: '検索してください',
        };
        const settings = $.extend({}, defaults, options);

        return this.each(function () {
            let target = $(this);

            const layout = `
                <div class="searchable-select">
                    <input type="text" placeholder="${settings.placeholder}" class="${settings.searchBoxClass} search-box">
                    <div class="select-options">
                        ${target.find('option').map(function() {
                            return `<div data-value="${$(this).val() || ''}">${$(this).text() || '&nbsp;'}</div>`;
                        }).get().join('')}
                    </div>
                </div>
            `;

            const customSelect = $(layout);
            customSelect.append(target.clone(true));
            target.replaceWith(customSelect);
            target = customSelect.find('select');

            const optionsBox = $('.select-options', customSelect);
            const searchBox = $('.search-box', customSelect);

            // オプションを開く
            const open = () => {
                target.hide();
                searchBox.show();
                optionsBox.show();

                // 検索ボックスにフォーカス
                searchBox.focus();

                // オプション枠の幅を調整
                optionsBox.width(target.outerWidth(true));
            };

            // オプションを閉じる
            const close = () => {
                target.show();
                searchBox.hide();
                optionsBox.hide();
            };

            // セレクトボックスクリック時
            target.on('click', function () {
                open();
                const selectedText = optionsBox.find('.selected').text().trim();
                searchBox
                    .val(selectedText)
                    .focus();
            });

            // オプションの選択処理
            optionsBox.on('click', 'div', function () {
                const selectedValue = $(this).data('value');
                target.val(selectedValue);
                close();
                optionsBox.find('div').removeClass('selected');
                $(this).addClass('selected');
            });

            // 検索ボックスでフィルタリング
            searchBox.on('input', function () {
                const searchTerm = $(this).val().toLowerCase();
                optionsBox.find('div').each(function () {
                    const optionText = $(this).text().toLowerCase();
                    $(this).toggleClass('hidden', !optionText.includes(searchTerm));
                });
            });

            // セレクトボックス外をクリックした場合に非表示にする
            $(document).on('click', function (e) {
                if ($(e.target).closest('.searchable-select').length) {
                    return;
                }
                close();
            });
        });
    };

})();
