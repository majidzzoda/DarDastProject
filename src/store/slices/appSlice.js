import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_EDA = "http://localhost:3002/eda"
const API_TEXNIKA = "http://localhost:3002/texnika"
const API_MEBEL = "http://localhost:3002/mebel"
const API_BUKETI = "http://localhost:3002/buketi"
const API_PRODUCTI = "http://localhost:3002/produ%D1%81ti"
const API_KNIGI = "http://localhost:3002/knigi"

// Асинхронные экшены
export const fetchEda = createAsyncThunk('app/fetchEda', async () => {
  const res = await fetch(API_EDA)
  if (!res.ok) throw new Error('Ошибка загрузки еды')
  return res.json()
})

export const fetchTexnika = createAsyncThunk('app/fetchTexnika', async () => {
  const res = await fetch(API_TEXNIKA)
  if (!res.ok) throw new Error('Ошибка загрузки техники')
  return res.json()
})

export const fetchMebel = createAsyncThunk('app/fetchMebel', async () => {
  const res = await fetch(API_MEBEL)
  if (!res.ok) throw new Error('Ошибка загрузки мебели')
  return res.json()
})

export const fetchBuketi = createAsyncThunk('app/fetchBuketi', async () => {
  const res = await fetch(API_BUKETI)
  if (!res.ok) throw new Error('Ошибка загрузки букетов')
  return res.json()
})

export const fetchProdukti = createAsyncThunk('app/fetchProdukti', async () => {
  const res = await fetch(API_PRODUCTI)
  if (!res.ok) throw new Error('Ошибка загрузки продуктов')
  return res.json()
})

export const fetchKnigi = createAsyncThunk('app/fetchKnigi', async () => {
  const res = await fetch(API_KNIGI)
  if (!res.ok) throw new Error('Ошибка загрузки книг')
  return res.json()
})

const initialState = {
  locale: 'ru',
  user: null,

  eda: [],
  texnika: [],
  mebel: [],
  buketi: [],
  produkti: [],
  knigi: [],

  edaLoading: false,
  texnikaLoading: false,
  mebelLoading: false,
  buketiLoading: false,
  produktiLoading: false,
  knigiLoading: false,

  edaError: null,
  texnikaError: null,
  mebelError: null,
  buketiError: null,
  produktiError: null,
  knigiError: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder

      // EDA
      .addCase(fetchEda.pending, (state) => {
        state.edaLoading = true
        state.edaError = null
      })
      .addCase(fetchEda.fulfilled, (state, action) => {
        state.edaLoading = false
        state.eda = action.payload
      })
      .addCase(fetchEda.rejected, (state, action) => {
        state.edaLoading = false
        state.edaError = action.error.message
      })

      // TEXNIKA
      .addCase(fetchTexnika.pending, (state) => {
        state.texnikaLoading = true
        state.texnikaError = null
      })
      .addCase(fetchTexnika.fulfilled, (state, action) => {
        state.texnikaLoading = false
        state.texnika = action.payload
      })
      .addCase(fetchTexnika.rejected, (state, action) => {
        state.texnikaLoading = false
        state.texnikaError = action.error.message
      })

      // MEBEL
      .addCase(fetchMebel.pending, (state) => {
        state.mebelLoading = true
        state.mebelError = null
      })
      .addCase(fetchMebel.fulfilled, (state, action) => {
        state.mebelLoading = false
        state.mebel = action.payload
      })
      .addCase(fetchMebel.rejected, (state, action) => {
        state.mebelLoading = false
        state.mebelError = action.error.message
      })

      // BUKETI
      .addCase(fetchBuketi.pending, (state) => {
        state.buketiLoading = true
        state.buketiError = null
      })
      .addCase(fetchBuketi.fulfilled, (state, action) => {
        state.buketiLoading = false
        state.buketi = action.payload
      })
      .addCase(fetchBuketi.rejected, (state, action) => {
        state.buketiLoading = false
        state.buketiError = action.error.message
      })

      // PRODUKTI
      .addCase(fetchProdukti.pending, (state) => {
        state.produktiLoading = true
        state.produktiError = null
      })
      .addCase(fetchProdukti.fulfilled, (state, action) => {
        state.produktiLoading = false
        state.produkti = action.payload
      })
      .addCase(fetchProdukti.rejected, (state, action) => {
        state.produktiLoading = false
        state.produktiError = action.error.message
      })

      // KNIGI
      .addCase(fetchKnigi.pending, (state) => {
        state.knigiLoading = true
        state.knigiError = null
      })
      .addCase(fetchKnigi.fulfilled, (state, action) => {
        state.knigiLoading = false
        state.knigi = action.payload
      })
      .addCase(fetchKnigi.rejected, (state, action) => {
        state.knigiLoading = false
        state.knigiError = action.error.message
      })
  }
})

export const { setLocale, setUser } = appSlice.actions
export default appSlice.reducer
