import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Отдельные URL для каждого ресурса Mockapi
const API_EDA = "https://bacb0c2f642ae180.mokky.dev/dd_eda"
const API_TEXNIKA = "https://bacb0c2f642ae180.mokky.dev/dd_texnika"
const API_MEBEL = "https://bacb0c2f642ae180.mokky.dev/dd_mebel"
const API_BUKETI = "https://bacb0c2f642ae180.mokky.dev/dd_buketi"
const API_PRODUKTI = "https://bacb0c2f642ae180.mokky.dev/dd_producti"
const API_KNIGI = "https://bacb0c2f642ae180.mokky.dev/dd_knigi"

// Асинхронные экшены для Mockapi
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
  const res = await fetch(API_PRODUKTI)
  if (!res.ok) throw new Error('Ошибка загрузки продуктов')
  return res.json()
})

export const fetchKnigi = createAsyncThunk('app/fetchKnigi', async () => {
  const res = await fetch(API_KNIGI)
  if (!res.ok) throw new Error('Ошибка загрузки книг')
  return res.json()
})

// CRUD операции
export const createProduct = createAsyncThunk('app/createProduct', async ({ category, productData }) => {
  // Определяем URL в зависимости от категории
  let url;
  switch (category) {
    case 'eda': url = API_EDA; break;
    case 'texnika': url = API_TEXNIKA; break;
    case 'mebel': url = API_MEBEL; break;
    case 'buketi': url = API_BUKETI; break;
    case 'produkti': url = API_PRODUKTI; break;
    case 'knigi': url = API_KNIGI; break;
    default: throw new Error('Неизвестная категория');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
  if (!res.ok) throw new Error('Ошибка создания продукта')
  return res.json()
})

export const updateProduct = createAsyncThunk('app/updateProduct', async ({ category, id, productData }) => {
  let url;
  switch (category) {
    case 'eda': url = `${API_EDA}/${id}`; break;
    case 'texnika': url = `${API_TEXNIKA}/${id}`; break;
    case 'mebel': url = `${API_MEBEL}/${id}`; break;
    case 'buketi': url = `${API_BUKETI}/${id}`; break;
    case 'produkti': url = `${API_PRODUKTI}/${id}`; break;
    case 'knigi': url = `${API_KNIGI}/${id}`; break;
    default: throw new Error('Неизвестная категория');
  }

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
  if (!res.ok) throw new Error('Ошибка обновления продукта')
  return res.json()
})

export const deleteProduct = createAsyncThunk('app/deleteProduct', async ({ category, id }) => {
  let url;
  switch (category) {
    case 'eda': url = `${API_EDA}/${id}`; break;
    case 'texnika': url = `${API_TEXNIKA}/${id}`; break;
    case 'mebel': url = `${API_MEBEL}/${id}`; break;
    case 'buketi': url = `${API_BUKETI}/${id}`; break;
    case 'produkti': url = `${API_PRODUKTI}/${id}`; break;
    case 'knigi': url = `${API_KNIGI}/${id}`; break;
    default: throw new Error('Неизвестная категория');
  }

  const res = await fetch(url, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Ошибка удаления продукта')
  return { category, id }
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
    addProductToCategory: (state, action) => {
      const { category, product } = action.payload
      if (state[category]) {
        state[category].push(product)
      }
    },
    updateProductInCategory: (state, action) => {
      const { category, id, updates } = action.payload
      if (state[category]) {
        const index = state[category].findIndex(item => item.id === id)
        if (index !== -1) {
          state[category][index] = { ...state[category][index], ...updates }
        }
      }
    },
    removeProductFromCategory: (state, action) => {
      const { category, id } = action.payload
      if (state[category]) {
        state[category] = state[category].filter(item => item.id !== id)
      }
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

      // CRUD операции
      .addCase(createProduct.fulfilled, (state, action) => {
        const { category } = action.meta.arg
        if (state[category]) {
          state[category].push(action.payload)
        }
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const { category, id } = action.meta.arg
        if (state[category]) {
          const index = state[category].findIndex(item => item.id === id)
          if (index !== -1) {
            state[category][index] = { ...state[category][index], ...action.payload }
          }
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const { category, id } = action.payload
        if (state[category]) {
          state[category] = state[category].filter(item => item.id !== id)
        }
      })
  }
})

export const { 
  setLocale, 
  setUser, 
  addProductToCategory, 
  updateProductInCategory, 
  removeProductFromCategory 
} = appSlice.actions

export default appSlice.reducer