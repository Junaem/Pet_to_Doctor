import { Card, CardMedia, Grid, Button, Input } from "@mui/material";
import { deletePet } from "api/pet";
import React, { useState } from "react";

function UserPets(props) {
  const [isPetMod, setIsPetMod] = useState(false);
  const pet = props.pet;

  return (
    <Grid item sx={{ border: 1 }}>
      <Card>
        <CardMedia component="img" height="140" src={`${process.env.PUBLIC_URL}/img/dogDefaultProfile.jpg`} alt="petPhoto" />
        {isPetMod === false ? (
          <Grid container>
            <Grid item xs={12}>
              {pet.name}
            </Grid>
            <Grid item xs={12}>
              {pet.birthDate}
            </Grid>
            <Grid item xs={12}>
              {pet.species}
            </Grid>
            <Grid item xs={12}>
              {pet.weight}
            </Grid>
            <Button
              onClick={() => {
                setIsPetMod(true);
              }}
              variant="contained"
            >
              펫정보수정
            </Button>
            <Button
              onClick={() => {
                props.handleDeletePetInfo(pet.id);
                setIsPetMod(false);
              }}
            >
              펫정보삭제
            </Button>
          </Grid>
        ) : (
          <Grid container>
            <Grid item xs={12}>
              <Input defaultValue={pet.name} onChange={props.changeModPetInfo("name")} />
            </Grid>
            <Grid item xs={12}>
              <Input defaultValue={pet.birthDate} onChange={props.changeModPetInfo("birthDate")} />
            </Grid>
            <Grid item xs={12}>
              <Input defaultValue={pet.species} onChange={props.changeModPetInfo("species")} />
            </Grid>
            <Grid item xs={12}>
              <Input defaultValue={pet.weight} onChange={props.changeModPetInfo("weight")} />
            </Grid>
            <Button
              onClick={() => {
                setIsPetMod(false);
                props.handleModPetInfo(pet.id);
              }}
              variant="contained"
            >
              펫정보수정완료
            </Button>
            <Button
              onClick={() => {
                setIsPetMod(false);
              }}
              variant="contained"
            >
              펫정보수정취소
            </Button>
            <Button
              onClick={() => {
                props.handleDeletePetInfo(pet.id);
              }}
            >
              펫정보삭제
            </Button>
          </Grid>
        )}
      </Card>
    </Grid>
  );
}

export default UserPets;