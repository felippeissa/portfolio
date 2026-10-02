# Portfólio — Felipe Santiago

Site estático (HTML + CSS + JS), sem build. Publicado em https://felippeissa.github.io/portfolio/

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | Home: hero, trabalhos selecionados, sobre, competências, experiência, formação e contato |
| `projetos/*.html` | Uma página de case por projeto (Informatiza, Portal Goiás, FitBank, Austa Clínicas) |
| `styles.css` | Estilos gerais, temas claro/escuro e capas ilustradas dos projetos |
| `case.css` | Estilos extras das páginas de case |
| `script.js` | Animações ao rolar, troca de tema e idioma, cursor "Ver projeto", copiar e-mail |
| `assets/` | Vídeo do Informatiza, poster e imagens reais do Figma (`assets/informatiza/`) |
| `404.html` | Página de endereço não encontrado |

## Como editar textos

Edite entre os comentários `EDITE A PARTIR DAQUI` e `FIM da área de edição`.
Cada texto em português tem a versão em inglês no atributo `data-en="..."` ao lado:

```html
<p data-en="Text in English">Texto em português</p>
```

Ao mudar um texto, atualize os dois. Textos sem `data-en` aparecem iguais nos dois idiomas.

## Trocar um projeto da home

1. Em `index.html`, substitua um bloco `<section class="project">` inteiro.
2. Na mídia, use uma imagem (`<img src="assets/arquivo.jpg" alt="...">`), um vídeo
   (`<video src="..." autoplay muted loop playsinline>`) ou uma capa ilustrada (`<div class="cover ...">`).
3. Copie uma página de `projetos/` para o novo case e ajuste o link `href` da mídia.
4. Atualize o "Próximo projeto" no fim de cada case para manter a sequência.

## Depois de mudar CSS ou JS

Aumente o número da versão (`?v=8` → `?v=9`) nos links de `styles.css`, `case.css` e `script.js`
em todas as páginas, para que os visitantes não vejam a versão antiga em cache.

## Ver no computador

```bash
python -m http.server 8765
```

Depois abra http://localhost:8765/

## Publicar

Cada `git push` na branch `main` atualiza o GitHub Pages em cerca de 1 minuto.
