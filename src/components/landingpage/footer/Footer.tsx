import React from 'react';
import { Grid, Link, Typography, Container } from '@mui/material';
import logoIcon from 'public/images/logos/logoIcon.svg';
import Image from 'next/image';
import { appName } from '../../../utils/utils';

const Footer = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} justifyContent="center" mt={4}>
        <Grid item xs={12} sm={5} lg={4} textAlign="center">
          <Image src={logoIcon} alt="icon" height={32} width={32} />
          <Typography fontSize="16" color="textSecondary" mt={1} mb={4}>
            All rights reserved by {appName}. Designed & Developed by
            <Link target="_blank" href="https://adminmart.com/">
              <Typography color="textSecondary" component="span" display="inline">
                {' '}
                AdminMart
              </Typography>{' '}
            </Link>
            .
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;
