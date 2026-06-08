/**
 * cart.js  –  Construction Hub shared cart utility
 * Place this ONE file at your project ROOT.
 * Every page that needs cart features just adds:
 *   <script src="../../cart.js"></script>   (adjust path to reach root)
 */

const CART_KEY = 'ch_cart';

const Cart = (() => {

    function load() {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch { return []; }
    }

    function save(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('cartChanged', { detail: { items } }));
    }

    /**
     * Cart.add(item)
     * item = {
     *   id, name, type ('purchase'|'rental'),
     *   unitPrice, unit, qty, icon, image (optional path),
     *   startDate, endDate, days
     * }
     * – purchase: merges qty if id already exists
     * – rental  : replaces entry (dates set on checkout page)
     */
    function add(item) {
        const items = load();
        const idx   = items.findIndex(i => i.id === item.id);

        if (idx !== -1) {
            if (item.type === 'purchase') {
                items[idx].qty += (item.qty || 1);
            } else {
                items[idx] = { ...items[idx], ...item };
            }
        } else {
            items.push({
                id        : item.id          || String(Date.now()),
                name      : item.name        || 'Construction Item',
                type      : item.type        || 'purchase',
                unitPrice : item.unitPrice   || 0,
                unit      : item.unit        || 'Unit',
                qty       : item.qty         || 1,
                icon      : item.icon        || '🏗️',
                image     : item.image       || '',
                startDate : item.startDate   || '',
                endDate   : item.endDate     || '',
                days      : item.days        || 1,
            });
        }
        save(items);
    }

    function getAll()       { return load(); }
    function count()        { return load().length; }
    function remove(id)     { save(load().filter(i => i.id !== id)); }
    function clear()        { save([]); }
    function goToCheckout() { window.location.href = _rootPath() + 'checkout.html'; }

    /** Works out how many directories deep we are, so the link always lands at root */
    function _rootPath() {
        const depth = (window.location.pathname.match(/\//g) || []).length - 1;
        return depth > 0 ? '../'.repeat(depth) : '';
    }

    return { add, getAll, count, remove, clear, goToCheckout };
})();

/* ── Keep every cart badge on every page in sync ── */
function _updateBadge() {
    document.querySelectorAll('.ch-cart-badge').forEach(badge => {
        const n = Cart.count();
        badge.textContent = n;
        badge.style.display = n > 0 ? 'inline-flex' : 'none';
    });
}
window.addEventListener('cartChanged', _updateBadge);
document.addEventListener('DOMContentLoaded', _updateBadge);

/* ── Global toast (works on any page) ── */
function showCartToast(msg, isError = false) {
    let t = document.getElementById('_cartToast');
    if (!t) {
        t = document.createElement('div');
        t.id = '_cartToast';
        t.style.cssText = `
            position:fixed;bottom:30px;right:30px;z-index:99999;
            background:#1a1a2e;color:#fff;padding:14px 22px;
            border-radius:10px;font-family:'Segoe UI',sans-serif;
            font-size:.9rem;font-weight:500;
            box-shadow:0 8px 25px rgba(0,0,0,.2);
            border-left:4px solid #f39c12;
            transform:translateY(80px);opacity:0;
            transition:all .35s ease;pointer-events:none;`;
        document.body.appendChild(t);
    }
    t.style.borderLeftColor = isError ? '#e74c3c' : '#f39c12';
    t.textContent = msg;
    t.style.transform = 'translateY(0)';
    t.style.opacity   = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
        t.style.transform = 'translateY(80px)';
        t.style.opacity   = '0';
    }, 3000);
}
