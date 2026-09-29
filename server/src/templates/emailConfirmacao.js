export const emailConfirmacaoTemplate = (link) => `
    <!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template de E-mail</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Sekuya&display=swap"
        rel="stylesheet">


    <style>
        * {
            font-family: "Poppins", sans-serif;
            margin: 0;
        }

        body {
            box-sizing: border-box;
            width: 100vw;
            display: flex;
            justify-content: center;
            background-color: #f1f3f4;
            padding: 30px 16px;
        }

        body div {
            max-width: 600px;
            font-size: 14px;
            background-color: white;
            border-radius: 24px;
        }

        header {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 34px;
        }

        h1 {
            font-weight: 600;
            max-width: 84%;
            line-height: 1.1;
            margin: 34px 0;
            font-size: 28px;
        }

        header p {
            max-width: 84%;
        }

        .logo {
            background-color: #e0e0e0;
            width: 114px;
            padding: 8px;
            border-radius: 0;
        }

        .grafismos {
            background-color: #e0e0e0;
            height: 260px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 34px;
            border-radius: 0;
        }

        .cta-button {
            box-sizing: border-box;
            height: 46px;
            background-color: #3C4043;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            border: none;
            width: 100%;
            border-radius: 8px;
            margin-bottom: 20px;
            text-decoration: none;
        }

        .cta-button:hover {
            cursor: pointer;
        }

        ul {
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 14px;
            margin-bottom: 48px;
        }

        ul li {
            display: flex;
            gap: 24px;
        }

        li span {
            font-weight: 600;
        }

        footer {
            display: flex;
            justify-content: center;
        }

        footer div {
            border-top: 2px solid #e5e5e5;
            text-align: end;
            padding: 20px 0;
            width: 90%;
            border-radius: 0;
        }

        footer span {
            font-size: 10px;
            color: #707070;
        }
    </style>
</head>

<body>
    <div>
        <header>
            <div class="logo"> Logo </div>

            <h1> Seu lugar no mural está esperando por você! </h1>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 22px">
                <p> Sua conta foi criada com sucesso. </p>
                <p> Ative sua conta para começar a publicar informações, oportunidades, eventos e avisos para a
                    comunidade
                    de SMD. </p>
            </div>
        </header>

        <main>

            <div class="grafismos"> Grafismos </div>

            <div style="padding: 0 40px">

                <a class="cta-button" target="_blank" rel="noopener noreferrer" href=${link}
                    aria-label="Ativar conta no Mural SMD"> Ativar minha conta </a>

                <p style="margin-bottom: 34px;"> Se o botão não funcionar, você pode copiar e colar a seguinte URL no
                    seu navegador:
                    ${link}
                </p>

                <ul>
                    <li>
                        <div aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-megaphone preview-icon">
                                <path
                                    d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
                                <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
                                <path d="M8 6v8" />
                            </svg></div>
                        <div>
                            <span> Publique informações </span>
                            <p> Compartilhe conteúdos que podem ser relevantes para outros estudantes, professores e
                                membros
                                da
                                comunidade SMD. </p>
                        </div>
                    </li>

                    <li>
                        <div aria-hidden="true"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-graduation-cap preview-icon">
                                <path
                                    d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                                <path d="M22 10v6" />
                                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                            </svg> </div>
                        <div>
                            <span> Divulgue oportunidades </span>
                            <p> Compartilhe bolsas, projetos, atividades acadêmicas e outras oportunidades. </p>
                        </div>
                    </li>

                    <li>
                        <div aria-hidden="true"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-calendar-days preview-icon">
                                <path d="M8 2v3" />
                                <path d="M16 2v3" />
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18" />
                                <path d="M8 13h.01" />
                                <path d="M12 13h.01" />
                                <path d="M16 13h.01" />
                                <path d="M8 17h.01" />
                                <path d="M12 17h.01" />
                                <path d="M16 17h.01" />
                            </svg> </div>
                        <div>
                            <span> Divulgue eventos </span>
                            <p> Informe a comunidade sobre eventos, encontros e atividades do curso. </p>
                        </div>
                    </li>

                    <li>
                        <div aria-hidden="true"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-user-round-group preview-icon">
                                <path d="M17 21a5 5 0 00-10 0" />
                                <path d="M22 10.5a3.5 3.5 0 00-5.507-2.868" />
                                <path d="M7.507 7.632A3.5 3.5 0 002 10.5" />
                                <circle cx="12" cy="13" r="3" />
                                <circle cx="18.5" cy="4.5" r="2.5" />
                                <circle cx="5.5" cy="4.5" r="2.5" />
                            </svg> </div>
                        <div>
                            <span> Contribua com a comunidade </span>
                            <p> Ajude a manter as informações de SMD reunidas em um único espaço. </p>
                        </div>
                    </li>
                </ul>
            </div>
        </main>

        <footer>
            <div>
                <span> Esta é uma mensagem automática. Favor não responder. </span>
            </div>
        </footer>
    </div>
</body>

</html>
`