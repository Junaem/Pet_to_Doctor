import React, { useState } from "react";
import { TextField, Grid, Button, Typography, Box, Link, Snackbar, Alert } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { loginUser, userInfo } from "api/user.js";
import { getDoctorInfo } from "api/doctor.js";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";

const newTheme = createTheme({
    palette: {
        primary: {
            main: "#309FB3",
        },
    },
});

function UserLoginModal(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [state, setState] = useState(true);
    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const REST_API_KEY = "c9d9cd706215602e662da44e2c2150a2";
    const REDIRECT_URI = "https://i6b209.p.ssafy.io/petodoctor/kakaooauth";
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    const userLogin = async (user) => {
        // const loginRes = await loginUser({ email: user.email, password: user.password });
        const loginRes = await loginUser({ email: user.email, password: user.password }).catch((err) => {
            if (err.response.status === 401) {
                setOpen(true);
            }
        });
        sessionStorage.setItem("accessToken", loginRes);
        let decode_token = jwtDecode(loginRes);
        let info;
        if (decode_token.role === "ROLE_DOCTOR") info = await getDoctorInfo(decode_token.sub);
        else {
            info = await userInfo(decode_token.sub);
        }
        console.log(decode_token);
        console.log(info);
        info = { ...info, role: decode_token.role };
        dispatch({ type: "login", userData: info });
        props.onClose();
        navigate("/petodoctor");
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={newTheme}>
            <div>
                <Grid container maxHeight='800px' sx={{ height: "100vh" }}>
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        open={open}
                        autoHideDuration={2000}
                        onClose={handleClose}>
                        <Alert onClose={handleClose} severity='warning'>
                            아이디 또는 비밀번호를 확인해주세요
                        </Alert>
                    </Snackbar>
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: `url('${process.env.PUBLIC_URL}/img/loginDog.jpg')`,
                            backgroundRepeat: "no-repeat",
                            backgroundColor: (t) =>
                                t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                    <Grid item xs={12} sm={8} md={5} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}>
                            <Typography component='h1' variant='h4'>
                                <img src={`${process.env.PUBLIC_URL}/img/web_logo.png`} alt='펫투닥터로고' />
                            </Typography>
                            <Box component='form' noValidate /*onSubmit={handleSubmit}*/ sx={{ mt: 1 }}>
                                <TextField
                                    margin='normal'
                                    fullWidth
                                    id='email'
                                    label='Email Address'
                                    name='email'
                                    autoComplete='email'
                                    value={values.email}
                                    onChange={handleChange("email")}
                                    /*autoFocus*/
                                />
                                <TextField
                                    margin='normal'
                                    required
                                    fullWidth
                                    name='password'
                                    label='Password'
                                    type='password'
                                    id='password'
                                    autoComplete='current-password'
                                    value={values.password}
                                    onChange={handleChange("password")}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") userLogin(values);
                                    }}
                                />
                                {state ? (
                                    <Button
                                        onClick={() => {
                                            userLogin(values);
                                        }}
                                        fullWidth
                                        variant='contained'
                                        sx={{ mt: 3, mb: 1, py: 1 }}>
                                        로그인
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            userLogin(values);
                                        }}
                                        fullWidth
                                        variant='contained'
                                        sx={{ mt: 3, mb: 1, py: 1 }}>
                                        의사 로그인
                                    </Button>
                                )}

                                <Box>
                                    {/* <Button
                                        fullWidth
                                        variant='contained'
                                        sx={{ mt: 3, mb: 1 }}
                                        style={{ backgroundColor: "#03C75A" }}>
                                        <img
                                            src={`${process.env.PUBLIC_URL}/img/naver.png`}
                                            width='24px'
                                            alt='네이버로고'
                                        />
                                        네이버로 로그인
                                    </Button> */}
                                    {/* 네이버그린 #03C75A */}
                                    <a href={KAKAO_AUTH_URL} style={{ textDecoration: "none" }}>
                                        <Button
                                            fullWidth
                                            variant='contained'
                                            sx={{ mb: 2 }}
                                            style={{ backgroundColor: "#FEE500", color: "#000000" }}
                                            to={KAKAO_AUTH_URL}>
                                            <img
                                                src={`${process.env.PUBLIC_URL}/img/kakaolink_btn_small.png`}
                                                width='24px'
                                                alt='카카오로고'
                                            />
                                            카카오로 로그인
                                        </Button>
                                    </a>
                                    {/* 카카오옐로 #FEE500 */}
                                    <Typography variant='body2' align='center' sx={{ color: "#aeaeae" }}>
                                        펫투닥터가 처음이신가요?
                                    </Typography>
                                    <Link href='/petodoctor/userjoin' variant='body2'>
                                        <Typography variant='body2' align='center' sx={{ color: "#309FB3" }}>
                                            회원가입
                                        </Typography>
                                    </Link>
                                </Box>
                                <Grid container justifyContent='flex-end'>
                                    <Grid item>
                                        <Link
                                            href='#'
                                            variant='body2'
                                            sx={{ mr: 1, color: "#BABABA" }}
                                            underline='hover'>
                                            이메일 찾기
                                        </Link>
                                        <Box sx={{ color: "#CACACA", display: "inline" }}>|</Box>
                                        <Link
                                            href='#'
                                            variant='body2'
                                            sx={{ ml: 1, color: "#BABABA" }}
                                            underline='hover'>
                                            비밀번호 찾기
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </ThemeProvider>
    );
}

export default UserLoginModal;
