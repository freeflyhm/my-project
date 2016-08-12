export const setSomebody = ({ dispatch }, isTrue) => {
  dispatch('SET_SOMEBODY', isTrue)
}

export const pushSid = ({ dispatch }, sid) => {
  dispatch('PUSH_SID', sid)
}

export const clearSids = ({ dispatch }) => {
  dispatch('CLEAR_SIDS')
}

export const setAuthenticated = ({ dispatch }, authenticated) => {
  dispatch('SET_AUTHENTICATED', authenticated)
}

export const setToken = ({ dispatch }, token) => {
  dispatch('SET_TOKEN', token)
}

export const setSio = ({ dispatch }, sio) => {
  dispatch('SET_SIO', sio)
}

export const setSmlistDate = ({ dispatch }, smlistDate) => {
  dispatch('SET_SMLIST_DATE', smlistDate)
}

export const setCompany = ({ dispatch }, company) => {
  dispatch('SET_COMPANY', company)
}

export const setUser = ({ dispatch }, user) => {
  dispatch('SET_USER', user)
}

export const setCity = ({ dispatch }, city) => {
  dispatch('SET_CITY', city)
}
