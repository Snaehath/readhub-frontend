/**
 * NewBadge — A reusable gradient "New" label.
 * Usage: <NewBadge /> or conditionally: {isNew && <NewBadge />}
 *
 * Gradient flows left → right: blue → violet → pink
 */
export default function NewBadge() {
  return (
    <span className="relative -top-2 text-[8px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 leading-none select-none">
      New
    </span>
  );
}
