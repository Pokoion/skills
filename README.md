# JIJO Taldea

**Partaideak**  
- Iker Galarraga  
- Ibai Oñatibia  
- Jon Olea  

**Praktikaren URL publikoa**  
[https://pokoion.eus](https://pokoion.eus)

**Egindako hautazko atalak**  
- OAuth kautoketa (GitHub eta Google)
- Testak (Jest eta SuperTest)

---

### Oharrak

- OAuth kautoketa bidez sartutako erabiltzaileentzat identifikadore bezala izena erabili dugu, beraz adibidez Google-eko bi kontuk izen bera badute, bestearen kontura sartuko da (Badakigu hori gaizki dagoela eta berez Google/GitHub-eko kontuen id-a erabili beharko litzatekela, baina erabiltzaileen model-a ez dugu aldatu).
- UserSkill model-etik "verified" kendu dugu, ez genuen eta ezertarako erabiltzen (UserSkill-a gaindituta dagoen jakiteko "completed")
- Test-en atalean, mongo-rekin probak egiteko "MongoMemoryServer" erabili dugu.
