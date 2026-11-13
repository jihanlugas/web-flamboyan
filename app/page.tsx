'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

type Player = {
  id: string;
  name: string;
  gamesPlayed: number;
  shuttlecocksUsed: number;
  amountPaid: number;
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
  shuttlecockPrice: number;
  gamesPlayedEnabled: boolean;
};

type ParsedSavedData = {
  data: SavedData;
  error: string | null;
};

type PlayerDraft = {
  name: string;
  amountPaid: number;
};

type PriceDraft = {
  courtPrice: number;
  shuttlecockPrice: number;
  gamesPlayedEnabled: boolean;
};

const storageKey = 'main-bareng-data-v1';
const storageChangeEvent = 'main-bareng-data-change';
const storageReadErrorSnapshot = '__main_bareng_storage_read_error__';
const emptyPlayerDraft: PlayerDraft = {
  name: '',
  amountPaid: 0,
};
const emptySavedData: SavedData = {
  players: [],
  courtPrice: 0,
  shuttlecockPrice: 0,
  gamesPlayedEnabled: false,
};
const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const formatCurrency = (amount: number) => currencyFormatter.format(amount);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const getPlayerCost = (player: Player, data: SavedData) =>
  data.courtPrice + data.shuttlecockPrice * player.shuttlecocksUsed;
const getPaymentDescription = (balance: number) =>
  balance < 0
    ? `Kelebihan pembayaran ${formatCurrency(Math.abs(balance))}`
    : `Sisa pembayaran ${formatCurrency(balance)}`;

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
    return window.localStorage.getItem(storageKey);
  } catch {
    return storageReadErrorSnapshot;
  }
};

const getServerSnapshot = () => null;

const parseSavedData = (snapshot: string | null): ParsedSavedData => {
  if (snapshot === storageReadErrorSnapshot) {
    return {
      data: emptySavedData,
      error: 'Data sesi tidak dapat dibaca dari penyimpanan peramban. Data tidak diubah.',
    };
  }

  if (snapshot === null) return { data: emptySavedData, error: null };

  let parsedData: unknown;
  try {
    parsedData = JSON.parse(snapshot);
  } catch {
    return {
      data: emptySavedData,
      error: 'Format data sesi tidak dapat dibaca. Data lama tidak diubah.',
    };
  }

  if (!isRecord(parsedData) || !Array.isArray(parsedData.players)) {
    return {
      data: emptySavedData,
      error: 'Format data sesi tidak valid. Data lama tidak diubah.',
    };
  }

  const legacyPrices = isRecord(parsedData.prices) ? parsedData.prices : {};
  const courtPrice = parsedData.courtPrice ?? legacyPrices.court ?? 0;
  const shuttlecockPrice =
    parsedData.shuttlecockPrice ?? parsedData.shuttlePrice ?? legacyPrices.ball ?? 0;
  const gamesPlayedEnabled =
    parsedData.gamesPlayedEnabled === undefined ? false : parsedData.gamesPlayedEnabled;

  if (!isNonNegativeInteger(courtPrice) || !isNonNegativeInteger(shuttlecockPrice)) {
    return {
      data: emptySavedData,
      error: 'Harga pada data sesi harus bilangan bulat nol atau lebih. Data lama tidak diubah.',
    };
  }

  if (typeof gamesPlayedEnabled !== 'boolean') {
    return {
      data: emptySavedData,
      error: 'Pengaturan jumlah bermain tidak valid. Data lama tidak diubah.',
    };
  }

  const playerIds = new Set<string>();
  const players: Player[] = [];

  for (const [index, rawPlayer] of parsedData.players.entries()) {
    if (!isRecord(rawPlayer) || typeof rawPlayer.name !== 'string' || !rawPlayer.name.trim()) {
      return {
        data: emptySavedData,
        error: `Data pemain nomor ${index + 1} tidak valid. Data lama tidak diubah.`,
      };
    }

    const gamesPlayed = rawPlayer.gamesPlayed ?? 0;
    const shuttlecocksUsed = rawPlayer.shuttlecocksUsed ?? rawPlayer.shuttleCount ?? 0;
    const amountPaid = rawPlayer.amountPaid ?? rawPlayer.paid ?? 0;

    if (
      !isNonNegativeInteger(gamesPlayed) ||
      !isNonNegativeInteger(shuttlecocksUsed) ||
      !isNonNegativeInteger(amountPaid)
    ) {
      return {
        data: emptySavedData,
        error: `Jumlah atau pembayaran pemain nomor ${index + 1} tidak valid. Data lama tidak diubah.`,
      };
    }

    const savedId = typeof rawPlayer.id === 'string' && rawPlayer.id
      ? rawPlayer.id
      : `player-${index + 1}`;
    let id = savedId;
    let suffix = 1;
    while (playerIds.has(id)) {
      id = `${savedId}-${suffix}`;
      suffix += 1;
    }
    playerIds.add(id);

    players.push({
      id,
      name: rawPlayer.name,
      gamesPlayed,
      shuttlecocksUsed,
      amountPaid,
    });
  }

  return {
    data: {
      players,
      courtPrice,
      shuttlecockPrice,
      gamesPlayedEnabled,
    },
    error: null,
  };
};

const saveData = (data: SavedData) => {
  const snapshot = JSON.stringify(data);

  try {
    window.localStorage.setItem(storageKey, snapshot);
  } catch {
    return 'Data tidak berhasil disimpan. Periksa ruang dan izin penyimpanan peramban, lalu coba lagi.';
  }

  window.dispatchEvent(new Event(storageChangeEvent));
  return null;
};

const createWhatsAppReport = (data: SavedData) => {
  const lines = [
    'Laporan mabar badminton',
    `Harga bola: ${formatCurrency(data.shuttlecockPrice)}`,
  ];

  if (data.courtPrice > 0) {
    lines.push(`Harga lapangan per pemain: ${formatCurrency(data.courtPrice)}`);
  }

  lines.push('', 'Rincian pemain');

  if (data.players.length === 0) {
    lines.push('Belum ada pemain.');
  } else {
    data.players.forEach((player, index) => {
      const totalCost = getPlayerCost(player, data);
      const balance = totalCost - player.amountPaid;
      lines.push(
        `${index + 1}. ${player.name}`,
      );
      if (data.gamesPlayedEnabled) {
        lines.push(`   Jumlah bermain: ${player.gamesPlayed}`);
      }
      lines.push(
        `   Jumlah bola: ${player.shuttlecocksUsed}`,
        `   Total biaya: ${formatCurrency(totalCost)}`,
        `   Pembayaran: ${formatCurrency(player.amountPaid)}`,
        `   ${getPaymentDescription(balance)}`,
      );
    });
  }

  const totalCost = data.players.reduce(
    (total, player) => total + getPlayerCost(player, data),
    0,
  );
  const totalPaid = data.players.reduce((total, player) => total + player.amountPaid, 0);
  const remainingBalance = totalCost - totalPaid;
  const totalShuttles = data.players.reduce(
    (total, player) => total + player.shuttlecocksUsed,
    0,
  );

  lines.push(
    '',
    'Ringkasan sesi',
    `Jumlah pemain: ${data.players.length}`,
    `Jumlah bola: ${totalShuttles}`,
    `Total biaya: ${formatCurrency(totalCost)}`,
    `Total pembayaran: ${formatCurrency(totalPaid)}`,
    getPaymentDescription(remainingBalance),
  );

  return `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`;
};

type CounterProps = {
  label: string;
  playerName: string;
  value: number;
  onChange: (change: -1 | 1) => void;
};

const Counter = ({ label, playerName, value, onChange }: CounterProps) => (
  <div className="counter">
    <button
      aria-label={`Kurangi ${label.toLowerCase()} ${playerName}`}
      disabled={value === 0}
      onClick={() => onChange(-1)}
      type="button"
    >
      −
    </button>
    <input
      aria-label={`${label} ${playerName}`}
      min="0"
      readOnly
      style={{ width: `${Math.max(3, String(value).length)}ch` }}
      type="number"
      value={value}
    />
    <button
      aria-label={`Tambah ${label.toLowerCase()} ${playerName}`}
      disabled={value === Number.MAX_SAFE_INTEGER}
      onClick={() => onChange(1)}
      type="button"
    >
      +
    </button>
  </div>
);

export default function Home() {
  const savedDataSnapshot = useSyncExternalStore(
    subscribeToSavedData,
    getSavedDataSnapshot,
    getServerSnapshot,
  );
  const parsedSavedData = parseSavedData(savedDataSnapshot);
  const { players, courtPrice, shuttlecockPrice, gamesPlayedEnabled } = parsedSavedData.data;
  const [priceDraft, setPriceDraft] = useState<PriceDraft>({
    courtPrice: 0,
    shuttlecockPrice: 0,
    gamesPlayedEnabled: false,
  });
  const [playerDraft, setPlayerDraft] = useState<PlayerDraft>(emptyPlayerDraft);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [storageWriteError, setStorageWriteError] = useState<string | null>(null);

  const storageError = parsedSavedData.error ?? storageWriteError;
  const storageReadBlocked = parsedSavedData.error !== null;

  useEffect(() => {
    if (!dialog) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialog(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialog]);

  const openDialog = (nextDialog: Dialog) => {
    if (storageReadBlocked) return;
    setDialogError(null);
    setDialog(nextDialog);
  };

  const openSettings = () => {
    setPriceDraft({ courtPrice, shuttlecockPrice, gamesPlayedEnabled });
    openDialog({ type: 'settings' });
  };

  const openAddPlayer = () => {
    setPlayerDraft({ ...emptyPlayerDraft });
    openDialog({ type: 'add-player' });
  };

  const openEditPlayer = (player: Player) => {
    setPlayerDraft({
      name: player.name,
      amountPaid: player.amountPaid,
    });
    openDialog({ type: 'edit-player', playerId: player.id });
  };

  const persistData = (data: SavedData) => {
    const error = saveData(data);
    if (error) {
      setStorageWriteError(error);
      return false;
    }

    setStorageWriteError(null);
    setDialog(null);
    return true;
  };

  const savePlayer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = playerDraft.name.trim();

    if (!name) {
      setDialogError('Nama pemain tidak boleh kosong.');
      return;
    }

    if (!isNonNegativeInteger(playerDraft.amountPaid)) {
      setDialogError('Pembayaran harus bilangan bulat nol atau lebih.');
      return;
    }

    const playerData = {
      name,
      amountPaid: playerDraft.amountPaid,
    };
    const nextPlayers =
      dialog?.type === 'edit-player'
        ? players.map((player) =>
            player.id === dialog.playerId ? { ...player, ...playerData } : player,
          )
        : [...players, { id: crypto.randomUUID(), gamesPlayed: 0, shuttlecocksUsed: 0, ...playerData }];

    persistData({ ...parsedSavedData.data, players: nextPlayers });
  };

  const savePrices = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !isNonNegativeInteger(priceDraft.courtPrice) ||
      !isNonNegativeInteger(priceDraft.shuttlecockPrice)
    ) {
      setDialogError('Harga harus bilangan bulat nol atau lebih.');
      return;
    }

    persistData({ players, ...priceDraft });
  };

  const resetData = () => {
    persistData({ ...parsedSavedData.data, players: [] });
  };

  const deletePlayer = (playerId: string) => {
    persistData({
      ...parsedSavedData.data,
      players: players.filter((player) => player.id !== playerId),
    });
  };

  const updatePlayerCount = (
    playerId: string,
    field: 'gamesPlayed' | 'shuttlecocksUsed',
    change: -1 | 1,
  ) => {
    const player = players.find((item) => item.id === playerId);
    if (!player || !isNonNegativeInteger(player[field] + change)) return;

    persistData({
      ...parsedSavedData.data,
      players: players.map((item) =>
        item.id === playerId ? { ...item, [field]: item[field] + change } : item,
      ),
    });
  };

  const totalShuttles = players.reduce(
    (total, player) => total + player.shuttlecocksUsed,
    0,
  );
  const totalCost = players.reduce(
    (total, player) => total + getPlayerCost(player, parsedSavedData.data),
    0,
  );
  const totalPaid = players.reduce((total, player) => total + player.amountPaid, 0);
  const remainingBalance = totalCost - totalPaid;
  const whatsappUrl = createWhatsAppReport(parsedSavedData.data);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#main-content" aria-label="Main Bareng, beranda">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Main Bareng</span>
        </a>

        <nav className="header-actions" aria-label="Menu utama">
          <button
            className="nav-button"
            disabled={storageReadBlocked}
            onClick={openSettings}
            type="button"
          >
            Setting
          </button>
          <button
            className="nav-button nav-button-primary"
            disabled={storageReadBlocked}
            onClick={openAddPlayer}
            type="button"
          >
            <span aria-hidden="true">+</span> Tambah pemain
          </button>
          <button
            className="nav-button nav-button-reset"
            disabled={storageReadBlocked}
            onClick={() => openDialog({ type: 'reset' })}
            type="button"
          >
            Reset
          </button>
        </nav>
      </header>

      <div className="page-content" id="main-content">
        {storageError && (
          <p className="storage-message" role="alert">
            {storageError}
          </p>
        )}

        <section className="player-section" aria-label="Daftar pemain">
          {storageReadBlocked ? (
            <div className="empty-state">
              <h3>Data sesi tidak tersedia</h3>
              <p>Data pemain tidak ditampilkan agar data yang tersimpan tidak tertimpa.</p>
            </div>
          ) : players.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-mark" aria-hidden="true">+</span>
              <h3>Belum ada pemain</h3>
              <p>Tambahkan pemain pertama untuk memulai daftar.</p>
              <button
                className="button button-primary"
                disabled={storageReadBlocked}
                onClick={openAddPlayer}
                type="button"
              >
                Tambah pemain
              </button>
            </div>
          ) : (
            <ul className="player-list">
              {players.map((player) => {
                const playerCost = getPlayerCost(player, parsedSavedData.data);
                const playerBalance = playerCost - player.amountPaid;

                return (
                  <li className="player-list-item" key={player.id}>
                    <details className="player-collapsible">
                      <summary className="player-collapsible-header">
                        <span className="player-avatar" aria-hidden="true">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="player-name">{player.name}</span>
                        <span className="player-total">
                          <span className="player-total-label">Total biaya</span>
                          <strong>{formatCurrency(playerCost)}</strong>
                        </span>
                        <span className="collapsible-chevron" aria-hidden="true" />
                      </summary>
                      <div className="player-details">
                        <dl className="player-cost-details">
                          <div>
                            <dt>Nama pemain</dt>
                            <dd>{player.name}</dd>
                          </div>
                          {courtPrice > 0 && (
                            <div>
                              <dt>Harga lapangan</dt>
                              <dd>{formatCurrency(courtPrice)}</dd>
                            </div>
                          )}
                          <div>
                            <dt>Harga per bola</dt>
                            <dd>{formatCurrency(shuttlecockPrice)}</dd>
                          </div>
                          {gamesPlayedEnabled && (
                            <div className="player-count-row">
                              <dt>Jumlah bermain</dt>
                              <dd>
                                <Counter
                                  label="Jumlah bermain"
                                  playerName={player.name}
                                  value={player.gamesPlayed}
                                  onChange={(change) => updatePlayerCount(player.id, 'gamesPlayed', change)}
                                />
                              </dd>
                            </div>
                          )}
                          <div className="player-count-row">
                            <dt>Jumlah bola</dt>
                            <dd>
                              <Counter
                                label="Jumlah bola"
                                playerName={player.name}
                                value={player.shuttlecocksUsed}
                                onChange={(change) => updatePlayerCount(player.id, 'shuttlecocksUsed', change)}
                              />
                            </dd>
                          </div>
                          <div>
                            <dt>Total harga bola</dt>
                            <dd>{formatCurrency(shuttlecockPrice * player.shuttlecocksUsed)}</dd>
                          </div>
                          <div className="player-cost-grand-total">
                            <dt>Total biaya</dt>
                            <dd>{formatCurrency(playerCost)}</dd>
                          </div>
                          <div>
                            <dt>Sudah dibayar</dt>
                            <dd>{formatCurrency(player.amountPaid)}</dd>
                          </div>
                          <div className="player-cost-grand-total">
                            <dt>Sisa/kelebihan pembayaran</dt>
                            <dd>{getPaymentDescription(playerBalance)}</dd>
                          </div>
                        </dl>
                        <div className="player-actions">
                          <button
                            className="row-action"
                            disabled={storageReadBlocked}
                            onClick={() => openEditPlayer(player)}
                            type="button"
                          >
                            Edit pemain
                          </button>
                          <button
                            aria-label={`Hapus ${player.name}`}
                            className="row-action row-action-danger"
                            disabled={storageReadBlocked}
                            onClick={() => deletePlayer(player.id)}
                            type="button"
                          >
                            Hapus pemain
                          </button>
                        </div>
                      </div>
                    </details>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="summary-section" aria-labelledby="summary-title">
          <div className="summary-heading">
            <div>
              <p className="eyebrow">TOTAL BIAYA</p>
              <h2 id="summary-title">Ringkasan biaya</h2>
            </div>
            <a
              aria-disabled={storageReadBlocked}
              className="button button-export"
              href={storageReadBlocked ? undefined : whatsappUrl}
              rel="noreferrer"
              target="_blank"
              tabIndex={storageReadBlocked ? -1 : undefined}
              title={storageReadBlocked ? 'Data sesi tidak dapat dibaca' : 'Bagikan laporan melalui WhatsApp'}
            >
              Laporan WhatsApp
            </a>
          </div>

          {storageReadBlocked ? (
            <p className="summary-unavailable">
              Ringkasan tidak dapat dihitung sampai data sesi dapat dibaca.
            </p>
          ) : (
            <div className="cost-breakdown">
              <div className="cost-line">
                <span>Jumlah pemain</span>
                <span>{players.length}</span>
              </div>
              {courtPrice > 0 && (
                <div className="cost-line">
                  <span>Harga lapangan per pemain</span>
                  <span>{formatCurrency(courtPrice)}</span>
                </div>
              )}
              <div className="cost-line">
                <span>Jumlah bola</span>
                <span>{totalShuttles}</span>
              </div>
              <div className="cost-line">
                <span>Total pembayaran</span>
                <span>{formatCurrency(totalPaid)}</span>
              </div>
              <div className="cost-total">
                <span>Total biaya</span>
                <strong>{formatCurrency(totalCost)}</strong>
              </div>
              <div className="cost-line">
                <span>Sisa/kelebihan pembayaran</span>
                <span>{getPaymentDescription(remainingBalance)}</span>
              </div>
            </div>
          )}
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

            {storageWriteError && (
              <p className="storage-message" role="alert">
                {storageWriteError}
              </p>
            )}

            {dialog.type === 'settings' && (
              <>
                <p className="eyebrow">PENGATURAN</p>
                <h2 id="dialog-title">Pengaturan</h2>
                <p className="modal-description">
                  Tentukan harga dan fitur pencatatan.
                </p>
                <form className="modal-form" onSubmit={savePrices}>
                  <label className="field-label" htmlFor="court-price">
                    Harga lapangan
                    <span className="input-wrap">
                      <span>Rp</span>
                      <input
                        autoFocus
                        id="court-price"
                        min="0"
                        onChange={(event) =>
                          setPriceDraft((current) => ({
                            ...current,
                            courtPrice: Number(event.target.value) || 0,
                          }))
                        }
                        required
                        step="1"
                        type="number"
                        value={priceDraft.courtPrice}
                      />
                    </span>
                  </label>
                  <label className="field-label" htmlFor="shuttlecock-price">
                    Harga per bola
                    <span className="input-wrap">
                      <span>Rp</span>
                      <input
                        id="shuttlecock-price"
                        min="0"
                        onChange={(event) =>
                          setPriceDraft((current) => ({
                            ...current,
                            shuttlecockPrice: Number(event.target.value) || 0,
                          }))
                        }
                        required
                        step="1"
                        type="number"
                        value={priceDraft.shuttlecockPrice}
                      />
                    </span>
                  </label>
                  <label className="checkbox-label" htmlFor="games-played-enabled">
                    <input
                      checked={priceDraft.gamesPlayedEnabled}
                      id="games-played-enabled"
                      onChange={(event) =>
                        setPriceDraft((current) => ({
                          ...current,
                          gamesPlayedEnabled: event.target.checked,
                        }))
                      }
                      type="checkbox"
                    />
                    Aktifkan pencatatan jumlah bermain
                  </label>
                  {dialogError && <p className="field-error" role="alert">{dialogError}</p>}
                  <div className="modal-actions">
                    <button
                      className="button button-secondary"
                      onClick={() => setDialog(null)}
                      type="button"
                    >
                      Batal
                    </button>
                    <button className="button button-primary" type="submit">
                      Simpan pengaturan
                    </button>
                  </div>
                </form>
              </>
            )}

            {(dialog.type === 'add-player' || dialog.type === 'edit-player') && (
              <>
                <p className="eyebrow">
                  {dialog.type === 'add-player' ? 'PEMAIN BARU' : 'UBAH DATA PEMAIN'}
                </p>
                <h2 id="dialog-title">
                  {dialog.type === 'add-player' ? 'Tambah pemain' : 'Edit pemain'}
                </h2>
                <p className="modal-description">
                  {dialog.type === 'add-player'
                    ? 'Isi nama pemain untuk menambahkannya ke daftar.'
                    : 'Ubah nama pemain dan jumlah yang sudah dibayar.'}
                </p>
                <form className="modal-form" onSubmit={savePlayer}>
                  <label className="field-label" htmlFor="new-player-name">
                    Nama pemain
                    <input
                      autoFocus
                      id="new-player-name"
                      maxLength={60}
                      onChange={(event) =>
                        setPlayerDraft((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="Contoh: Andi"
                      required
                      value={playerDraft.name}
                    />
                  </label>
                  {dialog.type === 'edit-player' && (
                    <label className="field-label" htmlFor="player-amount-paid">
                      Sudah dibayar
                      <span className="input-wrap">
                        <span>Rp</span>
                        <input
                          id="player-amount-paid"
                          min="0"
                          onChange={(event) =>
                            setPlayerDraft((current) => ({
                              ...current,
                              amountPaid: Number(event.target.value) || 0,
                            }))
                          }
                          required
                          step="1"
                          type="number"
                          value={playerDraft.amountPaid}
                        />
                      </span>
                    </label>
                  )}
                  {dialogError && <p className="field-error" role="alert">{dialogError}</p>}
                  <div className="modal-actions">
                    <button
                      className="button button-secondary"
                      onClick={() => setDialog(null)}
                      type="button"
                    >
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
                <p className="eyebrow eyebrow-danger">RESET DATA PEMAIN</p>
                <h2 id="dialog-title">Reset sesi?</h2>
                <p className="modal-description">
                  Semua pemain dan data pembayaran akan dihapus. Harga dan pengaturan fitur tetap
                  disimpan. Tindakan ini tidak dapat dibatalkan.
                </p>
                {dialogError && <p className="field-error" role="alert">{dialogError}</p>}
                <div className="modal-actions">
                  <button
                    className="button button-secondary"
                    onClick={() => setDialog(null)}
                    type="button"
                  >
                    Batal
                  </button>
                  <button className="button button-danger" onClick={resetData} type="button">
                    Ya, reset pemain
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
