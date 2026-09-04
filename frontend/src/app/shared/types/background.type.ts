/**
 * Cenários de fundo possíveis no shell da aplicação.
 *
 * - 'default' → fundo claro padrão, usado na maioria das telas
 * - 'primary' → fundo azul de marca, usado nas telas de destaque (início e divisão)
 *
 * A string vira a classe CSS `bg--<valor>` no container do AppComponent.
 */
export type AppBackground = 'default' | 'primary';
