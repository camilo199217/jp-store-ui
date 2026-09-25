// Vuex 4 no tiene su package.json "exports" configurado para el resolver "bundler" de TypeScript.
// Esta declaración permite que TypeScript encuentre los tipos correctamente.
declare module 'vuex' {
  export { createStore, useStore, Store, Module, ActionContext, MutationTree, ActionTree, GetterTree, ModuleTree } from 'vuex/types/index.d'
}
