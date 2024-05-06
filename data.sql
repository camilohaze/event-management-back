INSERT INTO `categories` VALUES (1,'Concierto'),(2,'Conferencia'),(3,'Festival');

INSERT INTO `dates` VALUES (1,'2024-05-03',1),(2,'2024-05-04',1),(3,'2024-05-05',1),(4,'2024-05-06',1),(5,'2024-05-07',1),(6,'2024-05-08',1),(7,'2024-05-09',1),(8,'2024-05-10',1),(12,'2024-06-01',3),(13,'2024-06-02',3),(14,'2024-06-03',3),(15,'2024-06-04',3),(9,'2025-05-03',2),(10,'2025-05-04',2),(11,'2025-05-05',2);

INSERT INTO `events` VALUES (1,'La Sonora 2024','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure d.','21:00:00','20:00:00',1,1,'Parque Norte','6.2723557','-75.5679465818133',1,1),(2,'La Sonora 2025','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure d.','21:00:00','20:00:00',0,0,'Parque Norte','6.2723557','-75.5679465818133',1,1),(3,'La Sonora 2026','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure d.','21:00:00','20:00:00',1,0,'Parque Norte','6.2723557','-75.5679465818133',1,1);

INSERT INTO `images` VALUES (1,'http://localhost:3000/uploads/events_1714621530902-5109B3E468EE4EDAA.png',1),(2,'http://localhost:3000/uploads/events_1714622296244-30AA2A625AD0C4DF.png',2),(3,'https://picsum.photos/1200/400',3);

INSERT INTO `profiles` VALUES (1,'Cristian Camilo','Naranjo Valencia','3197845152',1),(2,'Cristian Camilo','Naranjo Valencia','3197845152',2);

INSERT INTO `users` VALUES (1,'cristian.naranjo@outlook.es','ea1beffa5f1fba8f02c7e23facda2989','admin'),(2,'camilo.nvalencia@gmail.com','ea1beffa5f1fba8f02c7e23facda2989','user');
