function makeCardsClickable() {
    let cards = document.querySelector('.cards').querySelectorAll('li');
    for (let i = 0; i < cards.length; i++) {
        // Get card content
        let link = cards[i].querySelector('a').href;
        let content = cards[i].innerHTML;

        // Wrap card content
        let a = document.createElement('a');
        let span = document.createElement('span');
        a.href = link;
        a.innerHTML = content;
        span.className = 'll-card-wrapper';
        span.appendChild(a);

        // Replace old content with wrapped content
        cards[i].innerHTML = '';
        cards[i].appendChild(span);
    }
}
document.addEventListener('DOMContentLoaded', (e) => {
    makeCardsClickable();
});
