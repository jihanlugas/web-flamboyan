'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

type Player = {
  id: string;
  name: string;
  shuttleCount: number;
  totalPrice: number;
  paid: number;
};

type Dialog =
  | { type: 'settings' }
  | { type: 'add-player' }
  | { type: 'edit-player'; playerId: string }
  | { type: 'reset' }
  | null;

type SavedData = {
  players: Player[];
  courtPrice: number;
  shuttlePrice: number;
};

type PlayerDraft = {
  name: string;
  shuttleCount: number;
  paid: number;
};

const storageKey = 'main-bareng-data-v1';
const storageChangeEvent = 'main-bareng-data-change';
const defaultPlayerDraft: PlayerDraft = { name: '', shuttleCount: 0, paid: 0 };
let memorySnapshot: string | null = null;
const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const formatCurrency = (amount: number) => currencyFormatter.format(amount);

const subscribeToSavedData = (onChange: () => void) => {
  window.addEventListener('storage', onChange);
  window.addEventListener(storageChangeEvent, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(storageChangeEvent, onChange);
  };
};

const getSavedDataSnapshot = () => {
  try {
    return window.localStorage.getItem(storageKey) ?? memorySnapshot;
  } catch {
    return memorySnapshot;
  }
};

const getServerSnapshot = () => null;

const parseSavedData = (snapshot: string | null): SavedData => {
  if (!snapshot) return { players: [], courtPrice: 0, shuttlePrice: 0 };

  try {
    const parsedData = JSON.parse(snapshot) as Partial<SavedData> & {
      prices?: { court?: number; ball?: number };
    };
    const courtPrice =
      typeof parsedData.courtPrice === 'number'
        ? parsedData.courtPrice
        : parsedData.prices?.court ?? 0;
    const shuttlePrice =
      typeof parsedData.shuttlePrice === 'number'
        ? parsedData.shuttlePrice
        : parsedData.prices?.ball ?? 0;
    const players = Array.isArray(parsedData.players)
      ? parsedData.players.flatMap((player, index) => {
          if (!player || typeof player.name !== 'string') return [];

          const shuttleCount =
            typeof player.shuttleCount === 'number' &&
            Number.isFinite(player.shuttleCount)
              ? player.shuttleCount
              : 0;

          return [{
            id: typeof player.id === 'string' ? player.id : `player-${index}`,
            name: player.name,
            shuttleCount,
            totalPrice: courtPrice + shuttlePrice * shuttleCount,
            paid:
              typeof player.paid === 'number' && Number.isFinite(player.paid)
                ? player.paid
                : 0,
          }];
        })
      : [];

    return {
      players,
      courtPrice,
      shuttlePrice,
    };
  } catch {
    return { players: [], courtPrice: 0, shuttlePrice: 0 };
  }
};

const saveData = (data: SavedData) => {
  const savedData = {
    ...data,
    players: data.players.map((player) => ({
      ...player,
      totalPrice: data.courtPrice + data.shuttlePrice * player.shuttleCount,
    })),
  };
  const snapshot = JSON.stringify(savedData);
  memorySnapshot = snapshot;

  try {
    window.localStorage.setItem(storageKey, snapshot);
  } catch {
    // Keep the current session usable when browser storage is unavailable.
  }

  window.dispatchEvent(new Event(storageChangeEvent));
};

export default function Home() {
  const savedDataSnapshot = useSyncExternalStore(
    subscribeToSavedData,
    getSavedDataSnapshot,
    getServerSnapshot,
  );
  const { players, courtPrice, shuttlePrice } = parseSavedData(savedDataSnapshot);
  const [priceDraft, setPriceDraft] = useState({ courtPrice: 0, shuttlePrice: 0 });
  const [playerDraft, setPlayerDraft] = useState<PlayerDraft>(defaultPlayerDraft);
  const [dialog, setDialog] = useState<Dialog>(null);

  useEffect(() => {
    if (!dialog) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialog(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialog]);

  const openSettings = () => {
    setPriceDraft({ courtPrice, shuttlePrice });
    setDialog({ type: 'settings' });
  };

  const openAddPlayer = () => {
    setPlayerDraft(defaultPlayerDraft);
    setDialog({ type: 'add-player' });
  };

  const openEditPlayer = (player: Player) => {
    setPlayerDraft({
      name: player.name,
      shuttleCount: player.shuttleCount,
      paid: player.paid,
    });
    setDialog({ type: 'edit-player', playerId: player.id });
  };

  const savePlayer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = playerDraft.name.trim();
    if (!name) return;

    const playerData = {
      name,
      shuttleCount: playerDraft.shuttleCount,
      totalPrice: courtPrice + shuttlePrice * playerDraft.shuttleCount,
      paid: playerDraft.paid,
    };
    const nextPlayers =
      dialog?.type === 'edit-player'
        ? players.map((player) =>
            player.id === dialog.playerId ? { ...player, ...playerData } : player,
          )
        : [...players, { id: crypto.randomUUID(), ...playerData }];

    saveData({ players: nextPlayers, courtPrice, shuttlePrice });
    setDialog(null);
  };

  const savePrices = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveData({ players, ...priceDraft });
    setDialog(null);
  };

  const resetData = () => {
    saveData({ players: [], courtPrice: 0, shuttlePrice: 0 });
    setDialog(null);
  };

  const totalShuttles = players.reduce((total, player) => total + player.shuttleCount, 0);
  const totalCost = players.reduce((total, player) => total + player.totalPrice, 0);
  const totalPaid = players.reduce((total, player) => total + player.paid, 0);
  const remainingBalance = totalCost - totalPaid;

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#main-content" aria-label="Main Bareng, beranda">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Main Bareng</span>
        </a>

        <nav className="header-actions" aria-label="Menu utama">
          <button className="nav-button" onClick={openSettings} type="button">
            Setting
          </button>
          <button className="nav-button nav-button-primary" onClick={openAddPlayer} type="button">
            <span aria-hidden="true">+</span> Add Pemain
          </button>
          <button className="nav-button nav-button-reset" onClick={() => setDialog({ type: 'reset' })} type="button">
            Reset
          </button>
        </nav>
      </header>

      <div className="page-content" id="main-content">
        <section className="player-section" aria-label="Daftar pemain">
          {players.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-mark" aria-hidden="true">+</span>
              <h3>Belum ada pemain</h3>
              <p>Tambahkan pemain pertama untuk memulai daftar.</p>
              <button className="button button-primary" onClick={openAddPlayer} type="button">
                Tambah pemain
              </button>
            </div>
          ) : (
            <ul className="player-list">
              {players.map((player, index) => (
                <li className="player-list-item" key={player.id}>
                  <details className="player-collapsible">
                    <summary className="player-collapsible-header">
                      <span className="player-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="player-avatar" aria-hidden="true">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="player-name">{player.name}</span>
                      <span className="player-total">
                        <span className="player-total-label">Total biaya</span>
                        <strong>{formatCurrency(player.totalPrice)}</strong>
                      </span>
                      <span className="collapsible-chevron" aria-hidden="true" />
                    </summary>
                    <div className="player-details">
                      <dl className="player-cost-details">
                        <div>
                          <dt>Nama pemain</dt>
                          <dd>{player.name}</dd>
                        </div>
                        <div>
                          <dt>Harga lapangan</dt>
                          <dd>{formatCurrency(courtPrice)}</dd>
                        </div>
                        <div>
                          <dt>Harga per shuttle</dt>
                          <dd>{formatCurrency(shuttlePrice)}</dd>
                        </div>
                        <div>
                          <dt>Jumlah shuttle</dt>
                          <dd>{player.shuttleCount}</dd>
                        </div>
                        <div>
                          <dt>Total harga shuttle</dt>
                          <dd>{formatCurrency(shuttlePrice * player.shuttleCount)}</dd>
                        </div>
                        <div className="player-cost-grand-total">
                          <dt>Total biaya</dt>
                          <dd>{formatCurrency(player.totalPrice)}</dd>
                        </div>
                        <div>
                          <dt>Sudah dibayar</dt>
                          <dd>{formatCurrency(player.paid)}</dd>
                        </div>
                        <div className="player-cost-grand-total">
                          <dt>Sisa tagihan</dt>
                          <dd>{formatCurrency(player.totalPrice - player.paid)}</dd>
                        </div>
                      </dl>
                      <div className="player-actions">
                        <button className="row-action" onClick={() => openEditPlayer(player)} type="button">
                          Edit nama
                        </button>
                        <button
                          className="row-action row-action-danger"
                          onClick={() => saveData({
                            players: players.filter((item) => item.id !== player.id),
                            courtPrice,
                            shuttlePrice,
                          })}
                          type="button"
                          aria-label={`Hapus ${player.name}`}
                        >
                          Hapus pemain
                        </button>
                      </div>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="summary-section" aria-labelledby="summary-title">
          <div className="summary-heading">
            <div>
              <p className="eyebrow">TOTAL BIAYA</p>
              <h2 id="summary-title">Ringkasan biaya</h2>
            </div>
            <button
              className="button button-export"
              disabled
              title="Format ekspor belum ditentukan"
              type="button"
            >
              Ekspor
            </button>
          </div>

          <div className="cost-breakdown">
            <div className="cost-line">
              <span>Jumlah pemain</span>
              <span>{players.length}</span>
            </div>
            <div className="cost-line">
              <span>Harga lapangan per pemain</span>
              <span>{formatCurrency(courtPrice)}</span>
            </div>
            <div className="cost-line">
              <span>Jumlah shuttle</span>
              <span>{totalShuttles}</span>
            </div>
            <div className="cost-line">
              <span>Total sudah dibayar</span>
              <span>{formatCurrency(totalPaid)}</span>
            </div>
            <div className="cost-total">
              <span>Total tagihan</span>
              <strong>{formatCurrency(totalCost)}</strong>
            </div>
            <div className="cost-line">
              <span>Sisa tagihan</span>
              <span>{formatCurrency(remainingBalance)}</span>
            </div>
          </div>
        </section>
      </div>

      {dialog && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialog(null);
          }}
        >
          <section
            aria-labelledby="dialog-title"
            aria-modal="true"
            className="modal-panel"
            role="dialog"
          >
            <button
              aria-label="Tutup dialog"
              className="modal-close"
              onClick={() => setDialog(null)}
              type="button"
            >
              ×
            </button>

            {dialog.type === 'settings' && (
              <>
                <p className="eyebrow">PENGATURAN</p>
                <h2 id="dialog-title">Pengaturan harga</h2>
                <p className="modal-description">Tentukan harga lapangan dan harga untuk setiap shuttle.</p>
                <form className="modal-form" onSubmit={savePrices}>
                  <label className="field-label" htmlFor="court-price">
                    Harga lapangan
                    <span className="input-wrap">
                      <span>Rp</span>
                      <input
                        autoFocus
                        id="court-price"
                        min="0"
                        onChange={(event) => setPriceDraft((current) => ({ ...current, courtPrice: Number(event.target.value) || 0 }))}
                        required
                        type="number"
                        value={priceDraft.courtPrice}
                      />
                    </span>
                  </label>
                    <label className="field-label" htmlFor="shuttle-price">
                    Harga per shuttle
                    <span className="input-wrap">
                      <span>Rp</span>
                      <input
                        id="shuttle-price"
                        min="0"
                        onChange={(event) => setPriceDraft((current) => ({ ...current, shuttlePrice: Number(event.target.value) || 0 }))}
                        required
                        type="number"
                        value={priceDraft.shuttlePrice}
                      />
                    </span>
                  </label>
                  <div className="modal-actions">
                    <button className="button button-secondary" onClick={() => setDialog(null)} type="button">
                      Batal
                    </button>
                    <button className="button button-primary" type="submit">
                      Simpan harga
                    </button>
                  </div>
                </form>
              </>
            )}

            {(dialog.type === 'add-player' || dialog.type === 'edit-player') && (
              <>
                <p className="eyebrow">{dialog.type === 'add-player' ? 'PEMAIN BARU' : 'UBAH DATA PEMAIN'}</p>
                <h2 id="dialog-title">{dialog.type === 'add-player' ? 'Tambah pemain' : 'Edit pemain'}</h2>
                <p className="modal-description">Isi nama, jumlah shuttle, dan jumlah yang sudah dibayar.</p>
                <form className="modal-form" onSubmit={savePlayer}>
                  <label className="field-label" htmlFor="new-player-name">
                    Nama pemain
                    <input
                      autoFocus
                      id="new-player-name"
                      maxLength={60}
                      onChange={(event) => setPlayerDraft((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Contoh: Andi"
                      required
                      value={playerDraft.name}
                    />
                  </label>
                  <label className="field-label" htmlFor="player-shuttle-count">
                    Jumlah shuttle
                    <input
                      id="player-shuttle-count"
                      min="0"
                      onChange={(event) => setPlayerDraft((current) => ({ ...current, shuttleCount: Number(event.target.value) || 0 }))}
                      required
                      type="number"
                      value={playerDraft.shuttleCount}
                    />
                  </label>
                  <label className="field-label" htmlFor="player-paid">
                    Sudah dibayar
                    <span className="input-wrap">
                      <span>Rp</span>
                      <input
                        id="player-paid"
                        min="0"
                        onChange={(event) => setPlayerDraft((current) => ({ ...current, paid: Number(event.target.value) || 0 }))}
                        required
                        type="number"
                        value={playerDraft.paid}
                      />
                    </span>
                  </label>
                  <div className="modal-actions">
                    <button className="button button-secondary" onClick={() => setDialog(null)} type="button">
                      Batal
                    </button>
                    <button className="button button-primary" type="submit">
                      {dialog.type === 'add-player' ? 'Tambahkan' : 'Simpan perubahan'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {dialog.type === 'reset' && (
              <>
                <p className="eyebrow eyebrow-danger">RESET DATA</p>
                <h2 id="dialog-title">Reset pengaturan dan pemain?</h2>
                <p className="modal-description">
                  Semua pemain dan harga yang tersimpan di browser akan dihapus. Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="modal-actions">
                  <button className="button button-secondary" onClick={() => setDialog(null)} type="button">
                    Batal
                  </button>
                  <button className="button button-danger" onClick={resetData} type="button">
                    Ya, reset data
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
