-- MySQL dump 10.13  Distrib 8.4.5, for macos15.4 (arm64)
--
-- Host: 127.0.0.1    Database: collaboard
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Board`
--

DROP TABLE IF EXISTS `Board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Board` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `teamId` varchar(191) NOT NULL,
  `isMergeRequestRequired` tinyint(1) NOT NULL DEFAULT 1,
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `automergeDocId` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Board_teamId_fkey` (`teamId`),
  CONSTRAINT `Board_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Board`
--

LOCK TABLES `Board` WRITE;
/*!40000 ALTER TABLE `Board` DISABLE KEYS */;
INSERT INTO `Board` VALUES ('00e654a1-17df-4a5d-a26e-ec3b501e5cce','board testing','b0b70b0f-a578-468a-b24b-1afe4b60f455',0,1,'2025-04-13 14:27:44.401','2025-04-13 17:34:41.419','2zEpGx34G25xM2pGN8mj1obiNWEh'),('0322b3ff-4b97-46dd-a8a2-4f00d3277506','Smae Place Text Edit','47dcc98d-c81b-4580-93e1-560317ff2700',0,0,'2025-04-29 06:22:00.239','2025-04-29 06:22:00.239','Ead8G1pBUAmyE7TTANzt6GP7Tce'),('05968adc-d596-4183-bbff-07963782f3b7','Boar 2','b0b70b0f-a578-468a-b24b-1afe4b60f455',0,1,'2025-04-07 17:18:53.573','2025-04-13 17:34:45.810','3VsBdfVruYUtCAmobYryJhQQrz5j'),('109b146d-3e67-4cc5-b1b7-f4f217567cc6','Board test 2','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-26 10:35:43.188','2025-04-27 09:15:42.580','2YCsALeUxYAe6SosKYKzyHpisHZT'),('11061b40-e387-458c-ab98-6badfb0bc673','board test','4047010d-3b5d-434a-8345-905b4eb8936a',0,1,'2025-04-13 19:51:08.760','2025-04-13 19:55:22.101','hN2vHVpEChpabmy1e4RMozHVFYy'),('11aef234-61bd-41ee-af0f-4048cb550d66','new board','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-15 15:07:03.143','2025-04-24 19:23:37.950','2WmERCwkieKD8QuRGBUngRHrHujL'),('12377bb5-49cc-45bd-b74a-4d3eb68e2314','Board test','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-28 16:49:24.223','2025-04-29 05:55:21.526','4RXk1Y5eqRTkbBrCusinf9SeDUEG'),('126a2acc-cddf-49b8-b9cb-ec8c1b29ef4c','board 3','69127ad2-8394-486b-abdd-ba0338a9f56f',0,1,'2025-04-13 19:53:09.641','2025-04-13 19:56:18.043','2pJHQXrfm2ttxwbsyY211uNFyS5d'),('19648d40-d4e1-41c4-89e6-9f42d7b60e23','Board 1','b0b70b0f-a578-468a-b24b-1afe4b60f455',0,1,'2025-04-07 17:08:53.462','2025-04-07 17:44:26.390','PRZGzeVtAn2cLLRA7ibka82qwZH'),('1db54c3e-6c0a-46f8-9151-6f2e4e239209','Board 6','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-27 09:16:45.530','2025-04-27 09:26:43.963','HSKkTm7of5nBFeLTFY7QPqFobYQ'),('246862c6-907f-4d0b-9f44-0ab99b7470db','fresh board','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-16 09:55:41.160','2025-04-24 19:23:48.059','2ne4BsuHdaDCKE2nmqE1F9yTSdsB'),('2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','Color Edit','47dcc98d-c81b-4580-93e1-560317ff2700',0,0,'2025-04-29 06:10:57.272','2025-04-29 06:10:57.272','2pd3qNcRMbUyVZb1wnpr4PzBtvh5'),('3bb296fa-f3a3-4d9c-aabd-913019f48603','Edit & Delete','47dcc98d-c81b-4580-93e1-560317ff2700',0,0,'2025-04-29 06:17:02.213','2025-04-29 06:17:02.213','27aVJb8Bo8yZYjeRhbCQRxHHtnsE'),('3c31cbd0-d907-4429-bcf8-0b99396d2955','Friday meeting','4047010d-3b5d-434a-8345-905b4eb8936a',0,1,'2025-04-13 19:03:29.817','2025-04-13 19:55:26.845','zzwHjvDenSMJ4agWXjz5J64Y4VG'),('3ea0f78c-5784-48af-9bc7-61850a3952c8','Board 7','4047010d-3b5d-434a-8345-905b4eb8936a',0,1,'2025-04-13 19:40:10.565','2025-04-13 19:42:44.358','2Skfz33sLjv1T3JyKnVyjV6iypp8'),('449fd22e-1576-4050-8197-85bf979d4978','new board','69127ad2-8394-486b-abdd-ba0338a9f56f',0,1,'2025-04-13 19:48:34.871','2025-04-13 19:56:20.622','Lsh1SdiXf49uV49CqRho4YB4adV'),('4bc8f830-21e8-428b-bbdc-64d982f4901b','until never scary','team-03626',0,0,'2025-04-09 17:05:28.969','2025-04-09 17:05:28.969','3GD3WRCkcHjzYUeouUYjHAV2FcQg'),('529fcc20-63e8-4318-ac22-7770965c96b0','Unit 1','4047010d-3b5d-434a-8345-905b4eb8936a',0,1,'2025-04-13 18:58:31.337','2025-04-13 19:55:32.152','34rtsTmJ3DdhaozhU3WcTvg2cYzM'),('57719901-9598-4215-a912-97cd995bfea6','Board test 2','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-27 10:42:38.983','2025-04-29 05:55:25.827','2zzqL8fXC1qEnU5PmJJLHqdz81Jr'),('60bab8b0-adcf-4c33-8f3c-9b0ad2d64faa','Board test','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-14 10:45:49.116','2025-04-24 19:39:47.507','3XSV1XBdVePwZW5S9udZc1vr3EzM'),('69b4521b-6dda-4e05-86b7-263abe70c715','board 3 ','b0b70b0f-a578-468a-b24b-1afe4b60f455',0,1,'2025-04-13 13:41:46.730','2025-04-13 17:34:58.143','3vRVCh4LDBNGJxHQm4LiikJQzRrq'),('7e37a48e-5c80-4950-8b3f-bf1f791400e9','Add & Add','47dcc98d-c81b-4580-93e1-560317ff2700',0,0,'2025-04-29 05:55:57.506','2025-04-29 05:55:57.506','pougY6rHEg3f9e5gAPDYyPgvpjq'),('808405f2-f0b6-4bed-bdad-70be540cf250','Board test 2','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-24 17:24:12.795','2025-04-24 19:38:14.032','2saCsYFr2rmYhAPnXpFhBaVY4yy3'),('80ea8c7f-1368-4a91-be2e-823658e72607','board 6736','69127ad2-8394-486b-abdd-ba0338a9f56f',0,1,'2025-04-13 19:53:59.967','2025-04-13 19:56:23.191','3apTgfp8JWsXbN9bAAwkMT5YTh24'),('83b3d0b8-e659-437e-9db8-16807222671d','Board 3','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-15 15:06:10.911','2025-04-24 19:39:31.647','f74Qiam26wXuroay3V8yxncoQBg'),('84e4f2fc-d02d-4cbf-81f3-c55dafd56d92','board 2332','4047010d-3b5d-434a-8345-905b4eb8936a',0,1,'2025-04-13 19:53:52.095','2025-04-13 19:55:36.497','uG5U6dfT5go8yJyUkxMw7A9eCRe'),('8b3c7acd-8a97-4194-b8f6-05238b45eede','Shape Dimensions Edit','47dcc98d-c81b-4580-93e1-560317ff2700',0,0,'2025-04-29 06:15:14.652','2025-04-29 06:15:14.652','2eRRcqprD1mYJrEeppsQCnqQexbE'),('8c219045-6d75-44e0-bf4a-eb8323de81fd','new board','b0b70b0f-a578-468a-b24b-1afe4b60f455',0,1,'2025-04-07 17:28:58.170','2025-04-13 17:34:49.909','3hZWkZBbLnE6xTgimv6NJTKE91wS'),('8d86ab6f-3916-48a5-9455-cdfcc3c808fd','Thursday lesson','4047010d-3b5d-434a-8345-905b4eb8936a',0,1,'2025-04-13 19:57:17.973','2025-04-14 06:33:52.330','RE59vgCHXjz5g1cwB38tyzR4B6N'),('8da58aee-82d4-43cd-bc05-296cd32d4e59','Board test','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-24 19:53:33.564','2025-04-27 09:15:47.347','9CY6p98w6MZdbrkuNgwx2DFQQ54'),('9315abb8-6650-4782-aa5d-8af3f9544d76','board tesst','b0b70b0f-a578-468a-b24b-1afe4b60f455',0,1,'2025-04-13 13:40:40.106','2025-04-13 18:55:39.164','2mNZFNSSNNXqnWCRA4UGaMzF1xk2'),('b0741815-c119-45cc-abdd-f0c7cad55f29','Board 7','b0b70b0f-a578-468a-b24b-1afe4b60f455',0,1,'2025-04-07 17:44:06.236','2025-04-13 17:34:53.636','3YCU47kPPh3pJKfGppo4N61QdNpJ'),('b1dd340b-2357-41da-8ef0-c5f968ad978e','Board 3','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-27 09:06:52.138','2025-04-27 09:26:48.539','3GtJQUs3tTqtxr3b7QjTjhgFaDde'),('b2585671-9f7c-453f-bac9-b270a71cff12','Text Add','47dcc98d-c81b-4580-93e1-560317ff2700',0,0,'2025-04-29 06:19:20.218','2025-04-29 06:19:20.218','Ac3wHB8QGGripHtKvjAKUgyDKrB'),('b2ec7dc0-bf5a-4727-8ce3-e3cc5c2b8668','Board test 1','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-24 17:14:51.899','2025-04-24 19:39:36.155','3rUdbNux4u6s4ZKRAH5NmmzQokyd'),('ba1b3b99-ec02-4719-86c6-8e9d767c576f','new board','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-14 18:03:57.081','2025-04-15 15:06:55.511','H12ddeazoiAh947t4xMFf9fKWKL'),('c16b3413-a0bf-4add-84b1-89c1b829709d','Board test 2','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-26 09:51:58.933','2025-04-26 10:35:39.250','3gQQFSpyAJmxhZ29UivVTdqhLEUr'),('d284f0d3-f1fe-415d-aa0b-0061c4e4e783','Board test','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-27 09:27:02.185','2025-04-28 16:45:34.815','3JHdqTxh8qkhf9jf3KUhRKiTkPby'),('da399b53-096b-4b3e-85ac-fc52eeb888e7','board new','b0b70b0f-a578-468a-b24b-1afe4b60f455',0,1,'2025-04-13 13:58:55.682','2025-04-13 17:35:03.175','25GCwoxC31t3ArWWVFkcQ42uFEPP'),('db74148a-153b-4ceb-aef0-55c776544fc8','board 2','69127ad2-8394-486b-abdd-ba0338a9f56f',0,1,'2025-04-13 19:48:42.388','2025-04-13 19:56:25.772','hp9YRBRHbkLXsTJKFPtdH1AVAXZ'),('e3985d04-ccb2-4fdb-867b-f713bfa3778e','Board test','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-24 19:40:49.100','2025-04-24 19:53:10.970','22m26cjBYsGzUHTXHvHeSVWKqArQ'),('e41c2918-3ab6-494c-95ce-6714bd2e2534','Board 3','4047010d-3b5d-434a-8345-905b4eb8936a',0,1,'2025-04-13 19:36:43.638','2025-04-13 19:55:40.954','1ZsV24GwnqGHSez9dkTWFw2M2wF'),('f1b71b6e-5525-49e0-99ff-2b53946d98c5','new board','4047010d-3b5d-434a-8345-905b4eb8936a',0,1,'2025-04-13 19:46:57.319','2025-04-13 19:55:44.960','6srmSKywNokGGV59poauUqDb6NC'),('fce365fb-4728-4e1a-8ba8-49b48a6ae073','testing','bb507690-814d-4ddf-844b-49c0200d10b4',0,1,'2025-04-17 15:24:18.290','2025-04-24 19:39:42.787','2uXr6aYFG8mbSYczyizxQsRBogrm');
/*!40000 ALTER TABLE `Board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `id` varchar(191) NOT NULL,
  `boardId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `text` text NOT NULL,
  `objectId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Comment_boardId_fkey` (`boardId`),
  KEY `Comment_userId_fkey` (`userId`),
  CONSTRAINT `Comment_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MergeRequest`
--

DROP TABLE IF EXISTS `MergeRequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MergeRequest` (
  `id` varchar(191) NOT NULL,
  `boardId` varchar(191) NOT NULL,
  `requesterId` varchar(191) NOT NULL,
  `status` enum('OPEN','PENDING','MERGED','CLOSED') NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `changesId` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `MergeRequest_boardId_fkey` (`boardId`),
  KEY `MergeRequest_requesterId_fkey` (`requesterId`),
  CONSTRAINT `MergeRequest_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `MergeRequest_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MergeRequest`
--

LOCK TABLES `MergeRequest` WRITE;
/*!40000 ALTER TABLE `MergeRequest` DISABLE KEYS */;
INSERT INTO `MergeRequest` VALUES ('102a324c-6103-4990-96ac-25a52822cd49','3bb296fa-f3a3-4d9c-aabd-913019f48603','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','OPEN','2025-04-29 06:18:41.388','2025-04-29 06:18:41.388','68106f4174b0f1fbe7653616'),('2429b84f-35e9-49b9-b3e6-ade406ebdb97','2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','MERGED','2025-04-29 06:12:02.692','2025-04-29 06:13:55.649','68106db274b0f1fbe76535d6'),('37b78700-678e-496f-a251-8d441383f4b7','2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','c02c82c5-1589-4f53-afa1-3f6bbba4588d','OPEN','2025-04-29 06:14:24.558','2025-04-29 06:14:24.558','68106e4074b0f1fbe76535f7'),('3c6aae1c-8738-4bd6-9262-9079d6543453','7e37a48e-5c80-4950-8b3f-bf1f791400e9','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','MERGED','2025-04-29 06:09:46.863','2025-04-29 06:12:40.384','68106d2a74b0f1fbe76535cc'),('3e2899ad-d7b8-42f9-a82f-e552c2090662','2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','OPEN','2025-04-29 06:14:36.945','2025-04-29 06:14:36.945','68106e4c74b0f1fbe76535fb'),('612cd74a-9e9d-4eed-adf5-470c35eced0a','b2585671-9f7c-453f-bac9-b270a71cff12','c02c82c5-1589-4f53-afa1-3f6bbba4588d','OPEN','2025-04-29 06:21:19.933','2025-04-29 06:21:19.933','68106fdf74b0f1fbe7653628'),('763058a0-a16d-48e9-8cd2-c7289b16d847','2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','c02c82c5-1589-4f53-afa1-3f6bbba4588d','MERGED','2025-04-29 06:12:13.405','2025-04-29 06:13:59.651','68106dbd74b0f1fbe76535d8'),('9028ad00-25c4-41f6-9d24-87b361c1daaf','b2585671-9f7c-453f-bac9-b270a71cff12','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','OPEN','2025-04-29 06:21:03.240','2025-04-29 06:21:03.240','68106fcf74b0f1fbe7653621'),('a06b8c00-827b-4ee4-9d04-4139c42a2977','8b3c7acd-8a97-4194-b8f6-05238b45eede','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','OPEN','2025-04-29 06:16:12.101','2025-04-29 06:16:12.101','68106eac74b0f1fbe7653602'),('bafb0d6f-5004-4ccc-9ca0-4f7681b43e38','0322b3ff-4b97-46dd-a8a2-4f00d3277506','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','MERGED','2025-04-29 06:24:27.138','2025-04-29 06:24:51.844','6810709b74b0f1fbe765363d'),('dc80b999-1076-42b9-a4fa-743ba3825ff5','7e37a48e-5c80-4950-8b3f-bf1f791400e9','c02c82c5-1589-4f53-afa1-3f6bbba4588d','OPEN','2025-04-29 06:13:12.162','2025-04-29 06:13:12.162','68106df874b0f1fbe76535e3'),('ed971871-9cde-44b0-af91-e4f25d176ebd','7e37a48e-5c80-4950-8b3f-bf1f791400e9','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','OPEN','2025-04-29 06:13:38.932','2025-04-29 06:13:38.932','68106e1274b0f1fbe76535e7'),('ee03bb4c-1284-4bf5-88a9-8e2850912716','0322b3ff-4b97-46dd-a8a2-4f00d3277506','c02c82c5-1589-4f53-afa1-3f6bbba4588d','MERGED','2025-04-29 06:23:56.458','2025-04-29 06:24:45.713','6810707c74b0f1fbe7653635'),('eed145c8-4f0d-4d76-b031-2b9cd48584e5','3bb296fa-f3a3-4d9c-aabd-913019f48603','c02c82c5-1589-4f53-afa1-3f6bbba4588d','OPEN','2025-04-29 06:18:24.284','2025-04-29 06:18:24.284','68106f3074b0f1fbe7653610'),('f5be8baf-8918-46cf-b5f4-0c1110f3be96','0322b3ff-4b97-46dd-a8a2-4f00d3277506','c02c82c5-1589-4f53-afa1-3f6bbba4588d','OPEN','2025-04-29 06:25:24.812','2025-04-29 06:25:24.812','681070d474b0f1fbe7653651'),('f5e7328c-59bb-44e6-9b31-f12b98215607','0322b3ff-4b97-46dd-a8a2-4f00d3277506','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','OPEN','2025-04-29 06:26:04.724','2025-04-29 06:26:04.724','681070fc74b0f1fbe7653653'),('fcc3a7eb-f080-4828-a5f2-809274bbd28b','7e37a48e-5c80-4950-8b3f-bf1f791400e9','c02c82c5-1589-4f53-afa1-3f6bbba4588d','MERGED','2025-04-29 06:10:38.285','2025-04-29 06:12:47.168','68106d5e74b0f1fbe76535cf'),('fd4ee1f1-f44e-4b2c-952d-1878bed5c64c','8b3c7acd-8a97-4194-b8f6-05238b45eede','c02c82c5-1589-4f53-afa1-3f6bbba4588d','OPEN','2025-04-29 06:16:32.359','2025-04-29 06:16:32.359','68106ec074b0f1fbe7653607');
/*!40000 ALTER TABLE `MergeRequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ReviewRequest`
--

DROP TABLE IF EXISTS `ReviewRequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ReviewRequest` (
  `id` varchar(191) NOT NULL,
  `boardId` varchar(191) NOT NULL,
  `reviewerId` varchar(191) NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED') NOT NULL,
  `mergeRequestId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `ReviewRequest_boardId_fkey` (`boardId`),
  KEY `ReviewRequest_reviewerId_fkey` (`reviewerId`),
  KEY `ReviewRequest_mergeRequestId_fkey` (`mergeRequestId`),
  CONSTRAINT `ReviewRequest_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ReviewRequest_mergeRequestId_fkey` FOREIGN KEY (`mergeRequestId`) REFERENCES `MergeRequest` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ReviewRequest_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReviewRequest`
--

LOCK TABLES `ReviewRequest` WRITE;
/*!40000 ALTER TABLE `ReviewRequest` DISABLE KEYS */;
INSERT INTO `ReviewRequest` VALUES ('019bf519-ab8c-494d-8678-e99d109eb339','8b3c7acd-8a97-4194-b8f6-05238b45eede','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','a06b8c00-827b-4ee4-9d04-4139c42a2977','2025-04-29 06:16:12.101','2025-04-29 06:16:12.101'),('036b967d-b0e5-4fbe-ace6-192a87e7ca01','7e37a48e-5c80-4950-8b3f-bf1f791400e9','992b1f82-5913-4065-b2b4-fadbe397e1e5','ACCEPTED','3c6aae1c-8738-4bd6-9262-9079d6543453','2025-04-29 06:09:46.863','2025-04-29 06:12:40.384'),('09b6a79e-e694-4416-b833-26b0e1d58ac0','0322b3ff-4b97-46dd-a8a2-4f00d3277506','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','f5e7328c-59bb-44e6-9b31-f12b98215607','2025-04-29 06:26:04.724','2025-04-29 06:26:04.724'),('2152bae7-eb52-4e80-9511-5c189b190426','8b3c7acd-8a97-4194-b8f6-05238b45eede','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','fd4ee1f1-f44e-4b2c-952d-1878bed5c64c','2025-04-29 06:16:32.359','2025-04-29 06:16:32.359'),('368910a6-0113-45a8-8ab8-d5253781e628','0322b3ff-4b97-46dd-a8a2-4f00d3277506','992b1f82-5913-4065-b2b4-fadbe397e1e5','ACCEPTED','bafb0d6f-5004-4ccc-9ca0-4f7681b43e38','2025-04-29 06:24:27.138','2025-04-29 06:24:51.844'),('3d3febca-b841-4277-823b-7767e07a3a81','0322b3ff-4b97-46dd-a8a2-4f00d3277506','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','f5be8baf-8918-46cf-b5f4-0c1110f3be96','2025-04-29 06:25:24.812','2025-04-29 06:25:24.812'),('4ff86c61-718e-47ab-9f52-e5842f7081c1','b2585671-9f7c-453f-bac9-b270a71cff12','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','9028ad00-25c4-41f6-9d24-87b361c1daaf','2025-04-29 06:21:03.240','2025-04-29 06:21:03.240'),('51e09eea-d350-40d1-bc31-5f5eb0bf958e','7e37a48e-5c80-4950-8b3f-bf1f791400e9','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','ed971871-9cde-44b0-af91-e4f25d176ebd','2025-04-29 06:13:38.932','2025-04-29 06:13:38.932'),('5e870bbe-25a0-46a6-9f31-fe07f4dbff5d','2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','37b78700-678e-496f-a251-8d441383f4b7','2025-04-29 06:14:24.558','2025-04-29 06:14:24.558'),('5eb51254-15f6-4aa9-8550-57dc39b6fde7','0322b3ff-4b97-46dd-a8a2-4f00d3277506','992b1f82-5913-4065-b2b4-fadbe397e1e5','ACCEPTED','ee03bb4c-1284-4bf5-88a9-8e2850912716','2025-04-29 06:23:56.458','2025-04-29 06:24:45.713'),('6c9bd5cb-7598-4494-b2b4-bca2c1962862','2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','992b1f82-5913-4065-b2b4-fadbe397e1e5','ACCEPTED','763058a0-a16d-48e9-8cd2-c7289b16d847','2025-04-29 06:12:13.405','2025-04-29 06:13:59.651'),('87ce6980-8756-4365-9084-d01b051e32fc','3bb296fa-f3a3-4d9c-aabd-913019f48603','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','eed145c8-4f0d-4d76-b031-2b9cd48584e5','2025-04-29 06:18:24.284','2025-04-29 06:18:24.284'),('8a79c051-a1c0-4885-a2a1-a40b6850562d','2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','3e2899ad-d7b8-42f9-a82f-e552c2090662','2025-04-29 06:14:36.945','2025-04-29 06:14:36.945'),('9ed86142-2cd3-4cc8-8257-47fc7aa307bb','b2585671-9f7c-453f-bac9-b270a71cff12','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','612cd74a-9e9d-4eed-adf5-470c35eced0a','2025-04-29 06:21:19.933','2025-04-29 06:21:19.933'),('dad20968-b6e4-4387-befa-6eda6f5c5291','3bb296fa-f3a3-4d9c-aabd-913019f48603','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','102a324c-6103-4990-96ac-25a52822cd49','2025-04-29 06:18:41.388','2025-04-29 06:18:41.388'),('e05716ef-501a-4679-b38f-3bcf325c15d4','7e37a48e-5c80-4950-8b3f-bf1f791400e9','992b1f82-5913-4065-b2b4-fadbe397e1e5','PENDING','dc80b999-1076-42b9-a4fa-743ba3825ff5','2025-04-29 06:13:12.162','2025-04-29 06:13:12.162'),('e45ce82e-d151-4c92-9b14-bb8163284ff4','2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','992b1f82-5913-4065-b2b4-fadbe397e1e5','ACCEPTED','2429b84f-35e9-49b9-b3e6-ade406ebdb97','2025-04-29 06:12:02.692','2025-04-29 06:13:55.649'),('ea6c6244-c987-49cf-afbd-2ff80fa2b1cc','7e37a48e-5c80-4950-8b3f-bf1f791400e9','992b1f82-5913-4065-b2b4-fadbe397e1e5','ACCEPTED','fcc3a7eb-f080-4828-a5f2-809274bbd28b','2025-04-29 06:10:38.285','2025-04-29 06:12:47.168');
/*!40000 ALTER TABLE `ReviewRequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Team`
--

DROP TABLE IF EXISTS `Team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Team` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Team`
--

LOCK TABLES `Team` WRITE;
/*!40000 ALTER TABLE `Team` DISABLE KEYS */;
INSERT INTO `Team` VALUES ('4047010d-3b5d-434a-8345-905b4eb8936a','English Class','2025-04-13 18:58:12.663','2025-04-14 06:33:52.426',1),('47dcc98d-c81b-4580-93e1-560317ff2700','Test team','2025-04-29 05:55:35.373','2025-04-29 05:55:35.373',0),('69127ad2-8394-486b-abdd-ba0338a9f56f','team 2','2025-04-13 18:57:19.328','2025-04-13 19:56:25.864',1),('b0b70b0f-a578-468a-b24b-1afe4b60f455','Team test','2025-04-07 17:04:43.610','2025-04-13 18:55:39.234',1),('bb507690-814d-4ddf-844b-49c0200d10b4','Class team','2025-04-14 10:45:19.985','2025-04-29 05:55:37.951',1),('e0f74797-af39-4e64-ae6a-ce650769403a','Team test','2025-04-14 10:44:51.322','2025-04-14 10:44:54.376',1),('team-03626','Maggio - Brown','2025-04-09 11:21:30.989','2025-04-08 21:18:10.548',0);
/*!40000 ALTER TABLE `Team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TeamInvitation`
--

DROP TABLE IF EXISTS `TeamInvitation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TeamInvitation` (
  `id` varchar(191) NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `teamId` varchar(191) NOT NULL,
  `hostId` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TeamInvitation_teamId_fkey` (`teamId`),
  KEY `TeamInvitation_hostId_fkey` (`hostId`),
  CONSTRAINT `TeamInvitation_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `User` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `TeamInvitation_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TeamInvitation`
--

LOCK TABLES `TeamInvitation` WRITE;
/*!40000 ALTER TABLE `TeamInvitation` DISABLE KEYS */;
INSERT INTO `TeamInvitation` VALUES ('0250283a-7676-4c90-93d4-99a7835c14cb','ACCEPTED','47dcc98d-c81b-4580-93e1-560317ff2700','992b1f82-5913-4065-b2b4-fadbe397e1e5','peter@example.com','2025-04-29 05:56:30.619','2025-04-29 06:10:04.889'),('f87c2b72-8aa4-48da-8c69-273c1fb4bddd','ACCEPTED','47dcc98d-c81b-4580-93e1-560317ff2700','992b1f82-5913-4065-b2b4-fadbe397e1e5','julia.macuga@gmail.com','2025-04-29 05:56:15.120','2025-04-29 05:59:24.094');
/*!40000 ALTER TABLE `TeamInvitation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TeamLog`
--

DROP TABLE IF EXISTS `TeamLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TeamLog` (
  `id` varchar(191) NOT NULL,
  `teamId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `action` enum('CREATED','DELETED','MEMBER_ADDED','MEMBER_REMOVED','ROLE_UPDATED','BOARD_CREATED','BOARD_DELETED','MERGE_REQUEST_CREATED','MERGE_REQUEST_UPDATED','REVIEW_REQUEST_CREATED','REVIEW_REQUEST_UPDATED') NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `message` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `TeamLog_teamId_fkey` (`teamId`),
  KEY `TeamLog_userId_fkey` (`userId`),
  CONSTRAINT `TeamLog_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `TeamLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TeamLog`
--

LOCK TABLES `TeamLog` WRITE;
/*!40000 ALTER TABLE `TeamLog` DISABLE KEYS */;
INSERT INTO `TeamLog` VALUES ('00906f0d-024f-4834-b840-d92761bb35d7','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-24 19:53:33.564','2025-04-24 19:53:33.564','Board Board test created'),('00d8b321-2a6b-40ca-865e-8bc58cda1382','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-15 15:06:10.911','2025-04-15 15:06:10.911','Board Board 3 created'),('00dee638-a2ff-4644-9b44-47b1581aa16a','bb507690-814d-4ddf-844b-49c0200d10b4','c02c82c5-1589-4f53-afa1-3f6bbba4588d','BOARD_CREATED','2025-04-27 09:06:52.138','2025-04-27 09:06:52.138','Board Board 3 created'),('00f354f4-afe9-41c2-84fd-bb2ef0985c69','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','MEMBER_REMOVED','2025-04-08 06:00:21.656','2025-04-08 06:00:21.656','User peter@example.com left the team'),('025f31d2-0906-43a0-8332-63d39ddaee22','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-26 10:35:39.250','2025-04-26 10:35:39.250','Board Board test 2 deleted'),('02e8c525-e799-4bfe-93fd-aef3468a9e53','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:56:23.191','2025-04-13 19:56:23.191','Board board 6736 deleted'),('06668007-f05a-4cf2-af7d-464bc510c63f','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_DELETED','2025-04-13 17:34:45.810','2025-04-13 17:34:45.810','Board Boar 2 deleted'),('071b4b1f-3e83-488c-9d74-5e6860113d9b','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-24 19:39:31.647','2025-04-24 19:39:31.647','Board Board 3 deleted'),('08a8e8d1-edb8-49c2-b389-1e94e912ea0e','47dcc98d-c81b-4580-93e1-560317ff2700','992b1f82-5913-4065-b2b4-fadbe397e1e5','CREATED','2025-04-29 05:55:35.373','2025-04-29 05:55:35.373','Team Test team was created'),('09f0b978-c8cf-41ea-87aa-cbaab10665c0','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:55:22.101','2025-04-13 19:55:22.101','Board board test deleted'),('0bbaad28-63f4-4ca3-bce1-a2a8bf53f591','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-27 09:15:42.580','2025-04-27 09:15:42.580','Board Board test 2 deleted'),('0e21e396-e083-490c-a473-db71881bf9bd','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','MEMBER_ADDED','2025-04-13 18:58:58.432','2025-04-13 18:58:58.432','User julia.macuga@gmail.com joined the team'),('0f67dccd-c708-4dc6-9b67-a763fb1499ec','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','MEMBER_ADDED','2025-04-24 17:42:57.938','2025-04-24 17:42:57.938','User peter@example.com joined the team'),('11e06fcf-d76a-4eb1-9f5f-933069297cb7','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 19:48:34.871','2025-04-13 19:48:34.871','Board new board created'),('13715431-3dbc-4918-9626-e931857a2b8c','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-27 09:15:47.347','2025-04-27 09:15:47.347','Board Board test deleted'),('1419becd-cf6c-4b6d-b02f-230b46231d6d','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:55:32.152','2025-04-13 19:55:32.152','Board Unit 1 deleted'),('182be260-a686-43e0-876d-c5dc4f962e1a','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','DELETED','2025-04-13 19:56:25.864','2025-04-13 19:56:25.864','Team team 2 was deleted'),('1b3ff154-e180-43e4-9c6d-928584a8d055','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_DELETED','2025-04-13 17:34:53.636','2025-04-13 17:34:53.636','Board Board 7 deleted'),('1fd69f68-7be8-42ac-97ee-1b1dfafedd7e','e0f74797-af39-4e64-ae6a-ce650769403a','992b1f82-5913-4065-b2b4-fadbe397e1e5','DELETED','2025-04-14 10:44:54.376','2025-04-14 10:44:54.376','Team Team test was deleted'),('222c2ca8-9a11-4562-aabb-135327eb65f1','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-24 17:24:12.795','2025-04-24 17:24:12.795','Board Board test 2 created'),('23941228-fda3-4f38-ba3a-2cb92b7dfa52','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_DELETED','2025-04-07 17:44:26.390','2025-04-07 17:44:26.390','Board Board 1 deleted'),('24bd72d6-cc7d-4103-ba0c-f974e1074adf','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-28 16:45:34.815','2025-04-28 16:45:34.815','Board Board test deleted'),('26c83962-9315-4f9b-a360-1952022b28b9','47dcc98d-c81b-4580-93e1-560317ff2700','992b1f82-5913-4065-b2b4-fadbe397e1e5','MEMBER_ADDED','2025-04-29 05:59:24.094','2025-04-29 05:59:24.094','User julia.macuga@gmail.com joined the team'),('271525f7-90ae-4179-aca4-5db7d31302d1','b0b70b0f-a578-468a-b24b-1afe4b60f455','c02c82c5-1589-4f53-afa1-3f6bbba4588d','BOARD_CREATED','2025-04-07 17:44:06.236','2025-04-07 17:44:06.236','Board Board 7 created'),('2c104fc2-7b13-426e-bc6a-2dddda97d7d4','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_DELETED','2025-04-13 18:55:39.164','2025-04-13 18:55:39.164','Board board tesst deleted'),('312ca3e1-534b-4282-aadd-3abbb7053ca4','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 19:51:08.760','2025-04-13 19:51:08.760','Board board test created'),('34beaa5f-6b5a-4366-bb36-8045ee0b7930','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-24 19:39:36.155','2025-04-24 19:39:36.155','Board Board test 1 deleted'),('3b761c8d-bc70-45e9-bda4-b00da9f77f5e','b0b70b0f-a578-468a-b24b-1afe4b60f455','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 13:40:40.106','2025-04-13 13:40:40.106','Board board tesst created'),('42617fd0-23e7-49b2-bae8-8c239dfdc981','b0b70b0f-a578-468a-b24b-1afe4b60f455','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-07 17:28:58.170','2025-04-07 17:28:58.170','Board new board created'),('4402d598-9515-4b70-aee7-17a8f0e263bf','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_DELETED','2025-04-13 17:34:58.143','2025-04-13 17:34:58.143','Board board 3  deleted'),('4729860c-288a-4417-8d43-00b1feeeb2d3','47dcc98d-c81b-4580-93e1-560317ff2700','c02c82c5-1589-4f53-afa1-3f6bbba4588d','BOARD_CREATED','2025-04-29 06:17:02.213','2025-04-29 06:17:02.213','Board Edit & Delete created'),('47be5db0-f984-4a2b-a072-e5bb203a2c52','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-24 19:39:42.787','2025-04-24 19:39:42.787','Board testing deleted'),('4a15e151-aa29-4017-8d34-a7fc3fa8f396','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:42:44.358','2025-04-13 19:42:44.358','Board Board 7 deleted'),('4e026424-8022-480a-aabf-37570ddc662b','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','CREATED','2025-04-13 18:58:12.663','2025-04-13 18:58:12.663','Team English Class was created'),('4e977a45-dd26-4c53-a10b-c21a73ef1b59','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-24 19:23:48.059','2025-04-24 19:23:48.059','Board fresh board deleted'),('5024181e-3996-41cd-b5d1-65af82a44316','47dcc98d-c81b-4580-93e1-560317ff2700','992b1f82-5913-4065-b2b4-fadbe397e1e5','MEMBER_ADDED','2025-04-29 06:10:04.889','2025-04-29 06:10:04.889','User peter@example.com joined the team'),('584dbd45-21cc-4fbb-bc4a-9cd7c34ec0aa','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-27 09:27:02.185','2025-04-27 09:27:02.185','Board Board test created'),('59636f3d-196a-4c62-bbbb-e03947c87504','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:55:40.954','2025-04-13 19:55:40.954','Board Board 3 deleted'),('612947cf-c76a-496a-9761-6746881ed9f7','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:55:44.960','2025-04-13 19:55:44.960','Board new board deleted'),('647a442e-1cea-45e3-98c0-92131b0b001a','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_DELETED','2025-04-13 17:34:41.419','2025-04-13 17:34:41.419','Board board testing deleted'),('653da44c-453f-477e-aca4-f7e3f62c7516','4047010d-3b5d-434a-8345-905b4eb8936a','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_CREATED','2025-04-13 19:40:10.565','2025-04-13 19:40:10.565','Board Board 7 created'),('65a26470-47ca-4277-b619-cca7334a7335','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-15 15:07:03.143','2025-04-15 15:07:03.143','Board new board created'),('65a78a14-c142-4dc8-9bce-cd0d3e7755cc','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-15 15:06:55.511','2025-04-15 15:06:55.511','Board new board deleted'),('65af197a-f809-49a3-8251-c5e8958f6a91','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','MEMBER_ADDED','2025-04-13 18:59:42.386','2025-04-13 18:59:42.386','User julia.macuga@gmail.com joined the team'),('65fdb8d1-b3b7-4b25-a36b-da562edc7bcf','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-29 05:55:25.827','2025-04-29 05:55:25.827','Board Board test 2 deleted'),('685bbbdb-c3e4-4564-9047-8040f44ea9a7','e0f74797-af39-4e64-ae6a-ce650769403a','992b1f82-5913-4065-b2b4-fadbe397e1e5','CREATED','2025-04-14 10:44:51.322','2025-04-14 10:44:51.322','Team Team test was created'),('6bbd241b-af79-444c-91c8-c1ab73ae1c39','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_DELETED','2025-04-13 17:34:49.909','2025-04-13 17:34:49.909','Board new board deleted'),('6bfd775f-db0d-4308-ad40-3cee7fb93f0c','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-14 06:33:52.330','2025-04-14 06:33:52.330','Board Thursday lesson deleted'),('705b9101-3ad0-4e55-bec5-cdde1cda0d47','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-24 19:38:14.032','2025-04-24 19:38:14.032','Board Board test 2 deleted'),('8175c9d3-ff3b-49ff-a086-60f39056e501','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:56:25.772','2025-04-13 19:56:25.772','Board board 2 deleted'),('84a5844a-166f-4c84-9704-164841f14e81','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','CREATED','2025-04-13 18:57:19.328','2025-04-13 18:57:19.328','Team team 2 was created'),('8ad72c8f-0b45-400f-ba1d-c0b5fcf984b9','team-03626','user-42790','BOARD_CREATED','2025-04-09 17:05:28.969','2025-04-09 17:05:28.969','Board until never scary created'),('902f66ea-3e61-4306-b410-9d4acad67056','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-27 09:26:48.539','2025-04-27 09:26:48.539','Board Board 3 deleted'),('9091f17b-8aa2-4daf-ad8a-1b8a5dc3bec8','47dcc98d-c81b-4580-93e1-560317ff2700','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_CREATED','2025-04-29 06:19:20.218','2025-04-29 06:19:20.218','Board Text Add created'),('90b1e04c-5d9f-4cff-9ac9-517ea3e74a7a','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-24 19:23:37.950','2025-04-24 19:23:37.950','Board new board deleted'),('91089ec5-f765-4474-92fa-41d021d303f1','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:56:18.043','2025-04-13 19:56:18.043','Board board 3 deleted'),('92589afa-053c-465c-93e1-5d232c5baad0','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_DELETED','2025-04-13 17:35:03.175','2025-04-13 17:35:03.175','Board board new deleted'),('9311cff3-9c9c-464e-86d2-c3f1b48e76fe','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','DELETED','2025-04-14 06:33:52.426','2025-04-14 06:33:52.426','Team English Class was deleted'),('9521d0bd-addd-4f8c-a089-b1a6dfa5000a','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','DELETED','2025-04-29 05:55:37.951','2025-04-29 05:55:37.951','Team Class team was deleted'),('95f018e5-0789-4f34-9884-e3342f7615dc','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','DELETED','2025-04-13 18:55:39.234','2025-04-13 18:55:39.234','Team Team test was deleted'),('989d7fd9-5cf8-4553-88f9-a9ebe995eaec','bb507690-814d-4ddf-844b-49c0200d10b4','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_CREATED','2025-04-28 16:49:24.223','2025-04-28 16:49:24.223','Board Board test created'),('9989fff5-6f26-480b-ad56-21530327dc0e','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-16 09:55:41.160','2025-04-16 09:55:41.160','Board fresh board created'),('9a666a3b-79a5-4341-b824-fed3c6222655','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','CREATED','2025-04-14 10:45:19.985','2025-04-14 10:45:19.985','Team Class team was created'),('9ac7e837-37d8-486e-8673-93a005c21a4b','47dcc98d-c81b-4580-93e1-560317ff2700','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-29 05:55:57.506','2025-04-29 05:55:57.506','Board Add & Add created'),('9f3efbd4-c14c-4602-96a5-8fce6e780755','4047010d-3b5d-434a-8345-905b4eb8936a','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_CREATED','2025-04-13 19:53:52.095','2025-04-13 19:53:52.095','Board board 2332 created'),('a2144575-b191-4bdd-84e1-6c3dbcca8d94','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 18:58:31.337','2025-04-13 18:58:31.337','Board Unit 1 created'),('a36cf076-4ac3-47c3-bd14-78e2185c73a1','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 19:03:29.817','2025-04-13 19:03:29.817','Board Friday meeting created'),('a41b0985-ecfb-4313-9315-a1d3c1165a8a','b0b70b0f-a578-468a-b24b-1afe4b60f455','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 13:41:46.730','2025-04-13 13:41:46.730','Board board 3  created'),('a51f9660-909b-4174-bde8-b683535b0a88','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','MEMBER_ADDED','2025-04-14 10:45:31.625','2025-04-14 10:45:31.625','User julia.macuga@gmail.com joined the team'),('a94edbff-2c75-4f7f-a6a0-7dde2cc27774','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-26 09:51:58.933','2025-04-26 09:51:58.933','Board Board test 2 created'),('a9774196-066b-4617-ae9f-cde36c433608','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-24 19:39:47.507','2025-04-24 19:39:47.507','Board Board test deleted'),('ac7bdaa6-7e3d-4d9a-bc24-5f4a66470571','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-14 18:03:57.081','2025-04-14 18:03:57.081','Board new board created'),('ae444400-5504-42fb-908f-404edf692fd3','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','MEMBER_ADDED','2025-04-07 17:06:56.354','2025-04-07 17:06:56.354','User peter@example.com joined the team'),('b14f2261-c4e2-4d24-bf78-bc349cab4579','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','CREATED','2025-04-07 17:04:43.610','2025-04-07 17:04:43.610','Team Team test was created'),('b3059364-ecb0-4f92-83cf-61afdea87462','b0b70b0f-a578-468a-b24b-1afe4b60f455','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 14:27:44.401','2025-04-13 14:27:44.401','Board board testing created'),('b90f1513-0f9e-4d98-81ef-7402d61dfea7','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:55:36.497','2025-04-13 19:55:36.497','Board board 2332 deleted'),('c0fd4927-8ceb-401a-af19-96762a47832c','b0b70b0f-a578-468a-b24b-1afe4b60f455','c02c82c5-1589-4f53-afa1-3f6bbba4588d','BOARD_CREATED','2025-04-07 17:08:53.462','2025-04-07 17:08:53.462','Board Board 1 created'),('c1824c92-3c4b-441a-832b-e67542bdae78','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:56:20.622','2025-04-13 19:56:20.622','Board new board deleted'),('c648b3d8-cd05-4591-94b3-4ff9d8ae1a24','4047010d-3b5d-434a-8345-905b4eb8936a','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_CREATED','2025-04-13 19:36:43.638','2025-04-13 19:36:43.638','Board Board 3 created'),('ccac8716-b039-424b-9bfc-165f9fc74531','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-27 09:16:45.530','2025-04-27 09:16:45.530','Board Board 6 created'),('cd39758f-0aff-4b75-b3bb-92c916898e86','b0b70b0f-a578-468a-b24b-1afe4b60f455','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 13:58:55.682','2025-04-13 13:58:55.682','Board board new created'),('d058b0cd-0533-4d4f-b837-c7bcf6f22fc2','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-24 17:14:51.899','2025-04-24 17:14:51.899','Board Board test 1 created'),('d1916fe8-935a-430a-9c80-3719cc45210c','47dcc98d-c81b-4580-93e1-560317ff2700','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_CREATED','2025-04-29 06:15:14.652','2025-04-29 06:15:14.652','Board Shape Dimensions Edit created'),('d2f72d17-8a98-4cff-84d6-4618b5cbd10c','b0b70b0f-a578-468a-b24b-1afe4b60f455','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-07 17:18:53.573','2025-04-07 17:18:53.573','Board Boar 2 created'),('d57a5fb2-59d0-4023-9dea-dea96eda9478','bb507690-814d-4ddf-844b-49c0200d10b4','c02c82c5-1589-4f53-afa1-3f6bbba4588d','BOARD_CREATED','2025-04-27 10:42:38.983','2025-04-27 10:42:38.983','Board Board test 2 created'),('d9114348-4817-4e01-827f-4fe7e6efaf73','47dcc98d-c81b-4580-93e1-560317ff2700','c02c82c5-1589-4f53-afa1-3f6bbba4588d','BOARD_CREATED','2025-04-29 06:10:57.272','2025-04-29 06:10:57.272','Board Color Edit created'),('dbd5b54a-f03f-4b24-a7a4-c4c3e614a629','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-14 10:45:49.116','2025-04-14 10:45:49.116','Board Board test created'),('dc7860c2-35a5-4123-a857-b2f668ee29d6','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-26 10:35:43.188','2025-04-26 10:35:43.188','Board Board test 2 created'),('df4041ac-62d1-4a9e-b353-7dd46bd265f5','bb507690-814d-4ddf-844b-49c0200d10b4','c02c82c5-1589-4f53-afa1-3f6bbba4588d','BOARD_CREATED','2025-04-24 19:40:49.100','2025-04-24 19:40:49.100','Board Board test created'),('e19a2d7e-4cf5-4450-a8bd-2acd1c8a69f6','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 19:48:42.388','2025-04-13 19:48:42.388','Board board 2 created'),('e441fc23-3816-4adb-910e-966b126f6940','47dcc98d-c81b-4580-93e1-560317ff2700','c02c82c5-1589-4f53-afa1-3f6bbba4588d','BOARD_CREATED','2025-04-29 06:22:00.239','2025-04-29 06:22:00.239','Board Smae Place Text Edit created'),('e9572d17-9a4e-4f6d-a2af-692774f13db6','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-27 09:26:43.963','2025-04-27 09:26:43.963','Board Board 6 deleted'),('eabc569a-25e3-4f68-802a-158cff5a9c47','bb507690-814d-4ddf-844b-49c0200d10b4','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_CREATED','2025-04-17 15:24:18.290','2025-04-17 15:24:18.290','Board testing created'),('eb4a9adb-d256-4f6f-aa3f-e1834650ea72','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 19:46:57.319','2025-04-13 19:46:57.319','Board new board created'),('ec2f3c03-d1a7-46aa-9d2c-1936d3573a7d','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-29 05:55:21.526','2025-04-29 05:55:21.526','Board Board test deleted'),('f156f5bb-08f5-47c5-8260-1e0ce1434a69','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-24 19:53:10.970','2025-04-24 19:53:10.970','Board Board test deleted'),('f1c666c5-8765-4418-88e7-a188082ad80e','4047010d-3b5d-434a-8345-905b4eb8936a','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_CREATED','2025-04-13 19:57:17.973','2025-04-13 19:57:17.973','Board Thursday lesson created'),('f6436b92-d48b-43a0-8e2f-3aae1ae7196a','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_CREATED','2025-04-13 19:53:09.641','2025-04-13 19:53:09.641','Board board 3 created'),('f739852a-162a-4fb6-bbba-5ec42cc3c423','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','MEMBER_ADDED','2025-04-07 17:07:00.372','2025-04-07 17:07:00.372','User jane@example.com joined the team'),('f856f04b-39ac-41e4-ba6d-2e29175f891c','69127ad2-8394-486b-abdd-ba0338a9f56f','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','BOARD_CREATED','2025-04-13 19:53:59.967','2025-04-13 19:53:59.967','Board board 6736 created'),('fba19cd5-2186-46c8-9e7e-1be0b222203f','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','BOARD_DELETED','2025-04-13 19:55:26.845','2025-04-13 19:55:26.845','Board Friday meeting deleted');
/*!40000 ALTER TABLE `TeamLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TeamMember`
--

DROP TABLE IF EXISTS `TeamMember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TeamMember` (
  `id` varchar(191) NOT NULL,
  `teamId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `roleId` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TeamMember_teamId_userId_key` (`teamId`,`userId`),
  KEY `TeamMember_userId_fkey` (`userId`),
  KEY `TeamMember_roleId_fkey` (`roleId`),
  CONSTRAINT `TeamMember_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `TeamRole` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `TeamMember_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `TeamMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TeamMember`
--

LOCK TABLES `TeamMember` WRITE;
/*!40000 ALTER TABLE `TeamMember` DISABLE KEYS */;
INSERT INTO `TeamMember` VALUES ('03cf1c9a-a93e-44f4-aabc-b8a07830ef18','e0f74797-af39-4e64-ae6a-ce650769403a','992b1f82-5913-4065-b2b4-fadbe397e1e5','e627997a-68bd-4c97-9322-525b9dd5594b'),('0e6f7bad-ec8a-4c85-b52f-9088d66d02a5','69127ad2-8394-486b-abdd-ba0338a9f56f','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','c6ca9129-32ba-460b-a7b4-27151dd3793f'),('24038046-7482-4bb8-b135-bd60528031fb','bb507690-814d-4ddf-844b-49c0200d10b4','c02c82c5-1589-4f53-afa1-3f6bbba4588d','c6ca9129-32ba-460b-a7b4-27151dd3793f'),('5ba7146d-81fa-4fb7-8e05-93b301feeff0','47dcc98d-c81b-4580-93e1-560317ff2700','c02c82c5-1589-4f53-afa1-3f6bbba4588d','c6ca9129-32ba-460b-a7b4-27151dd3793f'),('5d566b2b-79e8-457c-a517-aac5ba61bfe6','4047010d-3b5d-434a-8345-905b4eb8936a','992b1f82-5913-4065-b2b4-fadbe397e1e5','e627997a-68bd-4c97-9322-525b9dd5594b'),('781dbc1e-a4c7-41cc-856a-c94a0b6f13d4','b0b70b0f-a578-468a-b24b-1afe4b60f455','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','e627997a-68bd-4c97-9322-525b9dd5594b'),('7e0e9d1c-280e-4dff-b63f-c80d4a558df8','47dcc98d-c81b-4580-93e1-560317ff2700','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','c6ca9129-32ba-460b-a7b4-27151dd3793f'),('b266d28f-1689-4445-abe5-2f0b21664fae','69127ad2-8394-486b-abdd-ba0338a9f56f','992b1f82-5913-4065-b2b4-fadbe397e1e5','e627997a-68bd-4c97-9322-525b9dd5594b'),('c128a398-72c5-40f2-97bc-276343b6377a','bb507690-814d-4ddf-844b-49c0200d10b4','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','c6ca9129-32ba-460b-a7b4-27151dd3793f'),('de9e0cdd-6dc3-4911-99b3-e32afc838c49','b0b70b0f-a578-468a-b24b-1afe4b60f455','992b1f82-5913-4065-b2b4-fadbe397e1e5','c6ca9129-32ba-460b-a7b4-27151dd3793f'),('e0d67857-8c58-4d17-9379-3a52c070c70a','bb507690-814d-4ddf-844b-49c0200d10b4','992b1f82-5913-4065-b2b4-fadbe397e1e5','e627997a-68bd-4c97-9322-525b9dd5594b'),('e54964ef-f756-48c5-b3b9-431dced0c8ca','47dcc98d-c81b-4580-93e1-560317ff2700','992b1f82-5913-4065-b2b4-fadbe397e1e5','e627997a-68bd-4c97-9322-525b9dd5594b'),('f61cee5d-7b26-44ca-87c1-08e8533a09c3','4047010d-3b5d-434a-8345-905b4eb8936a','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','c6ca9129-32ba-460b-a7b4-27151dd3793f');
/*!40000 ALTER TABLE `TeamMember` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TeamRole`
--

DROP TABLE IF EXISTS `TeamRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TeamRole` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TeamRole_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TeamRole`
--

LOCK TABLES `TeamRole` WRITE;
/*!40000 ALTER TABLE `TeamRole` DISABLE KEYS */;
INSERT INTO `TeamRole` VALUES ('e627997a-68bd-4c97-9322-525b9dd5594b','Admin'),('c6ca9129-32ba-460b-a7b4-27151dd3793f','Member');
/*!40000 ALTER TABLE `TeamRole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `surname` varchar(191) NOT NULL,
  `passwordHash` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','julia.macuga@gmail.com','Julia','Macuga','$2a$10$WOYIgQmc/4bPYfkJz73dhO7T2cVAp5fpSmvHzFDbayH8pIVPEGW7G','juliam','2025-04-07 17:04:22.689','2025-04-07 17:04:22.689'),('992b1f82-5913-4065-b2b4-fadbe397e1e5','jane@example.com','Jane','Smith','$2a$10$SW7u6TDMZeF8aGm81Qix.eWnBPaVySOJCrqBauiwEXqnRDt9pwrw6','Jane','2025-04-07 17:03:51.911','2025-04-07 17:03:51.911'),('c02c82c5-1589-4f53-afa1-3f6bbba4588d','peter@example.com','Peter','Smith','$2a$10$3ve0uzzxkseCyc5ApevSIOyeVJK.rG9theGwrdxhjp0ABtTdVPjs.','peter','2025-04-07 17:03:20.964','2025-04-07 17:03:20.964'),('user-42790','Isobel_Kihn85@gmail.com','Isobel','Kihn','$2a$10$kRD9B/Xg2lDDOjzkj7E7Y.11haw3OGn3q8LQAZMRTYdpMsBPlGbAe','Isobel_Kihn51','2025-04-09 12:21:14.986','2025-04-09 07:33:33.268');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserLastViewedBoardLog`
--

DROP TABLE IF EXISTS `UserLastViewedBoardLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserLastViewedBoardLog` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `boardId` varchar(191) NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserLastViewedBoardLog_userId_boardId_key` (`userId`,`boardId`),
  KEY `UserLastViewedBoardLog_boardId_fkey` (`boardId`),
  CONSTRAINT `UserLastViewedBoardLog_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `UserLastViewedBoardLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserLastViewedBoardLog`
--

LOCK TABLES `UserLastViewedBoardLog` WRITE;
/*!40000 ALTER TABLE `UserLastViewedBoardLog` DISABLE KEYS */;
INSERT INTO `UserLastViewedBoardLog` VALUES ('02e36e47-57f5-4a37-afbd-ef08223bff1f','c02c82c5-1589-4f53-afa1-3f6bbba4588d','b1dd340b-2357-41da-8ef0-c5f968ad978e','2025-04-27 09:11:28.540'),('08787d83-9ff0-49f8-8638-200f5378c72c','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','2025-04-29 06:14:29.670'),('091a0957-856f-4d03-989b-57ec1d6cdae8','c02c82c5-1589-4f53-afa1-3f6bbba4588d','0322b3ff-4b97-46dd-a8a2-4f00d3277506','2025-04-29 06:25:15.637'),('0e037572-8c05-4184-9e93-2dd0a142bef3','992b1f82-5913-4065-b2b4-fadbe397e1e5','246862c6-907f-4d0b-9f44-0ab99b7470db','2025-04-19 11:10:59.542'),('1b496ae4-e831-44bd-bced-ebba69141a09','c02c82c5-1589-4f53-afa1-3f6bbba4588d','e3985d04-ccb2-4fdb-867b-f713bfa3778e','2025-04-24 19:43:33.173'),('1cc10bf6-b14b-41c7-8eb3-31ab7df4fae7','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','b2585671-9f7c-453f-bac9-b270a71cff12','2025-04-29 06:20:50.596'),('23c2e2aa-a5c3-422c-9af1-e61573b15190','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','808405f2-f0b6-4bed-bdad-70be540cf250','2025-04-24 18:11:07.493'),('27aebd1e-cee7-4783-ad4b-8ee3fb67de48','c02c82c5-1589-4f53-afa1-3f6bbba4588d','b2585671-9f7c-453f-bac9-b270a71cff12','2025-04-29 06:21:10.676'),('28f24e31-989b-4276-8c78-acf927e4ae2b','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','d284f0d3-f1fe-415d-aa0b-0061c4e4e783','2025-04-28 16:45:26.705'),('29dc1a15-4b0d-4be2-a51f-0d6be3f8f6f8','c02c82c5-1589-4f53-afa1-3f6bbba4588d','3bb296fa-f3a3-4d9c-aabd-913019f48603','2025-04-29 06:18:05.692'),('309bf11b-b3c1-4bfb-b080-a1404254e8ed','992b1f82-5913-4065-b2b4-fadbe397e1e5','8da58aee-82d4-43cd-bc05-296cd32d4e59','2025-04-26 11:21:25.750'),('32848035-6437-42be-9c78-93181c4110d9','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','12377bb5-49cc-45bd-b74a-4d3eb68e2314','2025-04-28 17:56:43.596'),('45a0b45c-3eca-4097-b8ae-587dd779f72f','c02c82c5-1589-4f53-afa1-3f6bbba4588d','d284f0d3-f1fe-415d-aa0b-0061c4e4e783','2025-04-28 16:45:24.036'),('45e6129f-44b1-482f-9c20-57821fef020e','992b1f82-5913-4065-b2b4-fadbe397e1e5','109b146d-3e67-4cc5-b1b7-f4f217567cc6','2025-04-27 10:15:08.587'),('48e0c754-f1b6-479b-8313-a1101a7a28ce','992b1f82-5913-4065-b2b4-fadbe397e1e5','83b3d0b8-e659-437e-9db8-16807222671d','2025-04-15 17:11:50.346'),('57fe0487-6a5d-4028-a438-c85a24a75439','c02c82c5-1589-4f53-afa1-3f6bbba4588d','7e37a48e-5c80-4950-8b3f-bf1f791400e9','2025-04-29 06:13:02.409'),('59345ac7-ac45-426c-a5e8-22f444d2ce58','c02c82c5-1589-4f53-afa1-3f6bbba4588d','8b3c7acd-8a97-4194-b8f6-05238b45eede','2025-04-29 06:16:23.220'),('5f03a301-b39e-4fca-a79e-9c6b66211b54','992b1f82-5913-4065-b2b4-fadbe397e1e5','d284f0d3-f1fe-415d-aa0b-0061c4e4e783','2025-04-28 16:45:28.865'),('67f18b09-7db1-4acf-a2d4-dec181fbe3a6','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','246862c6-907f-4d0b-9f44-0ab99b7470db','2025-04-24 18:07:12.693'),('68bb697b-9610-4030-9246-1d3f76d134cb','c02c82c5-1589-4f53-afa1-3f6bbba4588d','109b146d-3e67-4cc5-b1b7-f4f217567cc6','2025-04-27 09:04:48.867'),('69097859-a601-4d38-8838-2e859f0194c7','992b1f82-5913-4065-b2b4-fadbe397e1e5','57719901-9598-4215-a912-97cd995bfea6','2025-04-28 16:49:30.343'),('77135129-b67f-4851-b05c-b273bb117bab','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','83b3d0b8-e659-437e-9db8-16807222671d','2025-04-24 18:07:17.349'),('7c3cbfa7-f301-43e7-99e4-1d4323128497','c02c82c5-1589-4f53-afa1-3f6bbba4588d','2a5ef515-dbe8-4029-b0f4-69dfeb18f08b','2025-04-29 06:14:15.773'),('8105df99-1e97-49a1-9807-f2ec58ce3fe1','992b1f82-5913-4065-b2b4-fadbe397e1e5','fce365fb-4728-4e1a-8ba8-49b48a6ae073','2025-04-18 12:49:40.150'),('9025ba5c-64f1-4a20-9396-baeb40159cb0','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','11aef234-61bd-41ee-af0f-4048cb550d66','2025-04-24 18:07:08.551'),('a07de0b7-14c1-4377-b175-ce43c88ab3cb','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','8da58aee-82d4-43cd-bc05-296cd32d4e59','2025-04-26 08:38:33.608'),('a2e8fa26-e281-4814-8f03-8b27c107d438','992b1f82-5913-4065-b2b4-fadbe397e1e5','60bab8b0-adcf-4c33-8f3c-9b0ad2d64faa','2025-04-24 19:28:34.997'),('a334f24e-d119-421f-9ab2-bccab6f34ea8','c02c82c5-1589-4f53-afa1-3f6bbba4588d','12377bb5-49cc-45bd-b74a-4d3eb68e2314','2025-04-28 16:51:12.103'),('a5d86340-58e0-4804-bd12-ca723913ce4e','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','7e37a48e-5c80-4950-8b3f-bf1f791400e9','2025-04-29 06:13:23.504'),('aec49431-e550-4666-a7a1-3b1c450d7fb5','992b1f82-5913-4065-b2b4-fadbe397e1e5','e3985d04-ccb2-4fdb-867b-f713bfa3778e','2025-04-24 19:52:15.529'),('b1bdec1f-fa97-44a9-bb87-cb9cb6ad3006','c02c82c5-1589-4f53-afa1-3f6bbba4588d','57719901-9598-4215-a912-97cd995bfea6','2025-04-27 10:46:49.995'),('b20fc631-2690-443c-a730-daf51470bab4','992b1f82-5913-4065-b2b4-fadbe397e1e5','808405f2-f0b6-4bed-bdad-70be540cf250','2025-04-24 18:12:34.701'),('b8f625a8-031a-4f1c-864a-cea6588f7e88','992b1f82-5913-4065-b2b4-fadbe397e1e5','1db54c3e-6c0a-46f8-9151-6f2e4e239209','2025-04-27 09:26:39.209'),('b9dec5d4-83dc-4f4c-a49c-86c826fe20a3','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','ba1b3b99-ec02-4719-86c6-8e9d767c576f','2025-04-15 15:06:44.191'),('bb426265-68fc-497f-b58b-081683fe94c8','c02c82c5-1589-4f53-afa1-3f6bbba4588d','808405f2-f0b6-4bed-bdad-70be540cf250','2025-04-24 18:11:35.861'),('bccb27d7-f779-4fcf-ab23-87e08fc88a76','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','e3985d04-ccb2-4fdb-867b-f713bfa3778e','2025-04-24 19:44:36.800'),('bf185322-c23b-4b79-8fe7-51aafc0db07c','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','fce365fb-4728-4e1a-8ba8-49b48a6ae073','2025-04-18 13:05:07.352'),('c08aa363-be0b-4045-a9bf-8a1552f6fcc4','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','8b3c7acd-8a97-4194-b8f6-05238b45eede','2025-04-29 06:16:06.507'),('c7b5844e-ac41-4b53-96c3-412d2c09c6cf','c02c82c5-1589-4f53-afa1-3f6bbba4588d','8da58aee-82d4-43cd-bc05-296cd32d4e59','2025-04-27 08:21:02.019'),('cb0c81e3-b8d3-44d9-a275-9c8e8e6f8f2e','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','57719901-9598-4215-a912-97cd995bfea6','2025-04-27 11:44:22.367'),('ce15fa2b-f6c7-4c3a-9ee7-bdb6af7e154b','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','60bab8b0-adcf-4c33-8f3c-9b0ad2d64faa','2025-04-24 17:18:04.397'),('e55d1d07-6a17-43a8-a5b0-5208f0d596e2','992b1f82-5913-4065-b2b4-fadbe397e1e5','b2ec7dc0-bf5a-4727-8ce3-e3cc5c2b8668','2025-04-24 17:24:08.952'),('e5c0cfd1-3990-4721-a529-1b536186e9f7','992b1f82-5913-4065-b2b4-fadbe397e1e5','c16b3413-a0bf-4add-84b1-89c1b829709d','2025-04-26 10:35:28.601'),('e7d79f5a-0776-4204-a0dd-306e321f32fd','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','0322b3ff-4b97-46dd-a8a2-4f00d3277506','2025-04-29 06:25:30.778'),('e91a1eb0-5cd0-41ae-b3ff-0b66e6986672','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','b2ec7dc0-bf5a-4727-8ce3-e3cc5c2b8668','2025-04-24 18:07:21.862'),('ec3f2a6d-00c7-48cc-9af4-b00885db745b','992b1f82-5913-4065-b2b4-fadbe397e1e5','ba1b3b99-ec02-4719-86c6-8e9d767c576f','2025-04-15 15:05:55.140'),('f12d10a8-f6ed-43dc-bd6e-2cdc35e6a2d8','992b1f82-5913-4065-b2b4-fadbe397e1e5','b1dd340b-2357-41da-8ef0-c5f968ad978e','2025-04-27 09:17:50.066'),('f791e7d9-5403-4537-81e3-e75ca310a699','992b1f82-5913-4065-b2b4-fadbe397e1e5','11aef234-61bd-41ee-af0f-4048cb550d66','2025-04-24 17:14:42.744'),('fbb4739f-c4b6-4739-995e-9af88a33c1bf','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','3bb296fa-f3a3-4d9c-aabd-913019f48603','2025-04-29 06:18:34.618'),('fbd54bc3-7884-45de-8c4c-3251e40cbe80','992b1f82-5913-4065-b2b4-fadbe397e1e5','12377bb5-49cc-45bd-b74a-4d3eb68e2314','2025-04-29 05:38:20.205');
/*!40000 ALTER TABLE `UserLastViewedBoardLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserLastViewedTeamLog`
--

DROP TABLE IF EXISTS `UserLastViewedTeamLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserLastViewedTeamLog` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `teamId` varchar(191) NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserLastViewedTeamLog_userId_teamId_key` (`userId`,`teamId`),
  KEY `UserLastViewedTeamLog_teamId_fkey` (`teamId`),
  CONSTRAINT `UserLastViewedTeamLog_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `UserLastViewedTeamLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserLastViewedTeamLog`
--

LOCK TABLES `UserLastViewedTeamLog` WRITE;
/*!40000 ALTER TABLE `UserLastViewedTeamLog` DISABLE KEYS */;
INSERT INTO `UserLastViewedTeamLog` VALUES ('2344ecb9-7c1e-49ee-bd9a-3e07466160a4','992b1f82-5913-4065-b2b4-fadbe397e1e5','69127ad2-8394-486b-abdd-ba0338a9f56f','2025-04-29 05:58:49.459'),('3512c03c-65bb-4942-91e2-a4339f585d2d','992b1f82-5913-4065-b2b4-fadbe397e1e5','4047010d-3b5d-434a-8345-905b4eb8936a','2025-04-29 05:58:49.457'),('3f6cfb99-b220-4d4d-acdf-8acc3ca97a1c','992b1f82-5913-4065-b2b4-fadbe397e1e5','bb507690-814d-4ddf-844b-49c0200d10b4','2025-04-29 05:58:49.458'),('4c457ef3-8e7d-4b25-a019-ef52795d40c9','c02c82c5-1589-4f53-afa1-3f6bbba4588d','bb507690-814d-4ddf-844b-49c0200d10b4','2025-04-29 06:10:07.461'),('5f42670b-92a4-4aee-8c3c-7f6e88cd4883','992b1f82-5913-4065-b2b4-fadbe397e1e5','e0f74797-af39-4e64-ae6a-ce650769403a','2025-04-29 05:58:49.457'),('67d86116-c9bb-4f99-a36b-e82f9ef6da09','992b1f82-5913-4065-b2b4-fadbe397e1e5','b0b70b0f-a578-468a-b24b-1afe4b60f455','2025-04-29 05:58:49.459'),('d5bc2f33-b5fc-4bf4-9da1-028fb3c60717','992b1f82-5913-4065-b2b4-fadbe397e1e5','47dcc98d-c81b-4580-93e1-560317ff2700','2025-04-29 05:58:49.468'),('d83336ee-e088-4115-a053-1edcd97fe9c3','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','4047010d-3b5d-434a-8345-905b4eb8936a','2025-04-29 05:58:58.068'),('e7cd779d-1e5b-425a-bdb4-fd32a4c1a3b7','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','bb507690-814d-4ddf-844b-49c0200d10b4','2025-04-29 05:58:58.067'),('ea3c85cb-31fa-4252-9453-bee1e9050e5e','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','b0b70b0f-a578-468a-b24b-1afe4b60f455','2025-04-29 05:58:58.067'),('ef548a51-7b7f-40ab-8d18-9ce6ef067a8e','c02c82c5-1589-4f53-afa1-3f6bbba4588d','47dcc98d-c81b-4580-93e1-560317ff2700','2025-04-29 06:10:07.462'),('f97d9ec1-c842-4234-b73a-b7aebb37fbf8','5be7eeaf-e3b8-4b3a-ba4a-3823901b142d','69127ad2-8394-486b-abdd-ba0338a9f56f','2025-04-29 05:58:58.067');
/*!40000 ALTER TABLE `UserLastViewedTeamLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0e9833e4-8ebf-493a-a62b-fde8b4b0ab32','f37b8728520d5f59c7f0005efaa4a577100b3fdb7ebdd324bff3271b84649a68','2025-04-07 17:35:34.366','20250407173534_',NULL,NULL,'2025-04-07 17:35:34.356',1),('18b1e01b-b19e-4cf9-b9a3-3fa7c70c4861','d99e33357f8a05a1ed84488ff57e98a381f3187eaf24d7c2a023ed6c6c04e6b6','2025-04-07 16:39:26.807','20250407061232_team_logs',NULL,NULL,'2025-04-07 16:39:26.783',1),('3d3f9c2e-960f-4f50-8db2-b168d41b7a95','d5172eb806e7e8c8dd61a6172868f98054155b37c29701e60de75af75ad7a682','2025-04-15 14:28:23.959','20250415142823_',NULL,NULL,'2025-04-15 14:28:23.949',1),('4246f6f2-902e-48a6-be11-53d6294476c2','f589c5c573dbcc792c11b72f1f12fd35b386b6dc27bd4333a1eecb2e117aee46','2025-04-07 16:39:26.843','20250407163628_',NULL,NULL,'2025-04-07 16:39:26.838',1),('4950e57f-eafd-4413-999f-ed8e71aa7407','12f2b7cc8a8c08929f75583d0c66f417c00689f3303b26ca4d855c8600e0011f','2025-04-07 16:39:26.826','20250407073612_add_last_login',NULL,NULL,'2025-04-07 16:39:26.823',1),('4f748d83-5777-4d49-ac95-7c1ba22daafd','db6cb4e1e71a9b996dc3ae1f0622da6e59519ddbadd50d0edfb45b666cd83072','2025-04-07 16:39:26.751','20250321174635_init',NULL,NULL,'2025-04-07 16:39:26.647',1),('5f38893b-5197-4913-a88b-8e02d3961a09','5ab05f66463191ba15e4fdfec5841bed858b55bf80ad2efb92cc13af98f8f3d1','2025-04-07 16:39:26.823','20250407064552_deleted_board_log',NULL,NULL,'2025-04-07 16:39:26.807',1),('64b86d83-3b67-4a9d-adec-c6a7250aacf1','e5f54b4db5111d855a44c819bb634ff5dbc4b2d5cae4ff32355695103f3c187f','2025-04-07 16:39:26.768','20250405073748_team_archived_property',NULL,NULL,'2025-04-07 16:39:26.765',1),('6675a35f-40c6-4402-aef1-141b3c35b33c','fafee8d6527bd03c42c7493e520f7a7eb87256f2a21aa14b446f022535de1bf7','2025-04-07 16:39:26.756','20250403145354_add_review_request_updated_at_created_at',NULL,NULL,'2025-04-07 16:39:26.753',1),('75fd8efc-b9e9-41f6-bc10-b93d9172c3da','e9b404de8cf9d2277a37eb41bad4af27316ab86e1b83b6bd8b99b495e2a69ba0','2025-04-15 14:32:26.697','20250415143226_fixed_user_last_viewed_team_log_and_user_last_viewed_board_log_models',NULL,NULL,'2025-04-15 14:32:26.690',1),('8e1992ca-ecb4-4ec6-b02d-3e6cc467345f','f021e40cee323e74c3ea6c6fad7ee0ea3580ebb923872ef4e30e25920c0e435f','2025-04-07 16:39:26.764','20250403174754_deleted_board_document_id_param',NULL,NULL,'2025-04-07 16:39:26.761',1),('aa67a2ff-ff5f-4c9d-9247-6043892bfd7e','bafe3c59469738f7b9940f4c18b6902146cff5f91b4419ef62688c0358c67f6d','2025-04-07 16:39:26.833','20250407153951_add_user_last_viewed_log',NULL,NULL,'2025-04-07 16:39:26.827',1),('b017eb28-1cce-48a6-bfbf-d2ab733ec81a','2bc5cf482d8e222bd3aad07dbbf1ad5c617348d16532a4af57b6b1aefc20d88a','2025-04-15 14:27:54.866','20250415142754_user_last_viewed_log_split_to_team_and_board',NULL,NULL,'2025-04-15 14:27:54.820',1),('b319c9ac-cee2-4f68-8693-41519ed02367','5f3aaeaa4bc80f9360efa6a5bc70fe95363b4ab28631cee417b9317953f965a7','2025-04-07 16:39:26.778','20250405150437_board_action_to_enum',NULL,NULL,'2025-04-07 16:39:26.769',1),('db4ab584-546e-445c-ae6f-1e92a1e607e3','deb4b37f4872d89bf20091129e8e3bde4403cd77d7ebf0fd9668cc6060855fcd','2025-04-07 16:39:26.782','20250405150825_board_log_action_id_changed_to_action',NULL,NULL,'2025-04-07 16:39:26.779',1),('e26fed44-a774-4354-95ef-c7aead76c3c6','21e1eae93e271a68768a9fce44f67c692b462d4ee97144d22371c285bbb92beb','2025-04-07 16:39:26.838','20250407154625_',NULL,NULL,'2025-04-07 16:39:26.834',1),('e58f29ea-b7cf-4429-a7d8-d91ee45cc6e8','e7b246155659e4f74b265d25991328a78a22861ae4e20099791ea0fad33a0ee4','2025-04-07 17:33:31.433','20250407173331_drop_user_last_viewed_constained',NULL,NULL,'2025-04-07 17:33:31.420',1),('e66a65f2-82d2-46de-8819-151fbd95ceb9','5a6278712622ba9cada8f046fefb24b334be88f2a6dc5e8126743afd165d9d2e','2025-04-07 16:39:26.760','20250403173348_board_doc_url_changed_to_automerge_doc_id_added_board_document_id',NULL,NULL,'2025-04-07 16:39:26.757',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-29  8:33:51
