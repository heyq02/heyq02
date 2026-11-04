/** One playable title shown as a player-style identity card. */
export interface GameProfile {
  id: string
  name: string
  platform: string
  publisher?: string
  /** In-game nickname / ID people search for. */
  gameId: string
  server?: string
  /** Peak rank badge text, e.g. 荣耀王者. */
  peakRank: string
  /** Extra rank context, e.g. 赛季最高. */
  peakDetail?: string
  roles?: string[]
  note?: string
  href?: string
  cover?: string
}

export interface GamesData {
  title: string
  intro: string
  tip?: string
  profiles: GameProfile[]
}
