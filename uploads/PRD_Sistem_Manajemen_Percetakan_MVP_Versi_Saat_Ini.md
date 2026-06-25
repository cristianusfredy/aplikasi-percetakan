# Product Requirements Document: Sistem Manajemen Percetakan

## Executive Summary
Sistem Manajemen Percetakan adalah aplikasi internal untuk membantu percetakan mengelola operasional dari order masuk, multi-order pelanggan, perhitungan harga sederhana, pembagian tugas, status produksi, pembayaran, stok bahan sederhana, hingga laporan bisnis. Produk ini dibuat untuk menggantikan proses manual yang saat ini masih bergantung pada WhatsApp, catatan terpisah, dan komunikasi langsung antar tim. Fokus MVP adalah membantu pemilik, admin/kasir, desainer dan operator bekerja lebih rapi, cepat, mudah dipantau, dan user friendly. Fitur seperti portal pelanggan, invoice otomatis, barcode order, absensi karyawan, dan fitur lanjutan lainnya akan masuk ke fase berikutnya setelah alur internal stabil.

## Problem & Opportunity
Saat ini percetakan kesulitan mengelola pesanan, menghitung harga, memantau status produksi, mencatat pembayaran, dan membuat laporan karena proses masih dilakukan secara manual melalui WhatsApp. Kondisi ini menyebabkan order mudah tercecer, harga rawan salah hitung, status produksi sulit dipantau, pembayaran belum lunas sulit dilacak, dan pemilik harus bertanya manual kepada admin atau operator untuk mengetahui kondisi bisnis.

Masalah lain yang muncul adalah satu pelanggan bisa memiliki beberapa order berbeda dalam satu waktu. Jika admin harus menginput data pelanggan berulang untuk setiap produk, proses menjadi lambat dan rawan salah input. Karena itu, sistem perlu mendukung multi-order, yaitu satu transaksi pelanggan dapat berisi beberapa item pesanan.

Peluang utama dari aplikasi ini adalah menciptakan satu sistem terpusat yang menjadi sumber data utama operasional percetakan. Dengan sistem ini, admin dapat mencatat order secara rapi, menghitung harga lebih cepat menggunakan biaya dasar produk, operator/desainer dapat melihat tugas yang jelas, dan pemilik dapat memantau order, pembayaran, stok bahan, masalah produksi/desain, serta laporan tanpa harus bertanya satu per satu.

## Users & Personas
| Persona | Demographics | Goals | Frustrations |
|---------|--------------|-------|--------------|
| Pemilik Percetakan | Usia 30–50 tahun, mengurus order, keuangan, pelanggan, stok bahan, dan karyawan | Ingin memantau seluruh pekerjaan, pembayaran, stok bahan, dan laporan bisnis tanpa harus bertanya manual ke admin/operator | Sulit melihat pesanan yang belum selesai, pembayaran yang belum lunas, stok bahan, dan keuntungan harian/bulanan |
| Admin/Kasir | Usia 20–35 tahun, bertugas menerima order, menentukan harga, menjelaskan output produk ke konsumen, mencatat pembayaran, dan menyerahkan project ke tim desain/produksi | Ingin pekerjaan lebih tertata, input order lebih cepat, mudah terorganisir, mudah menganalisis data, dan lebih cepat melayani pelanggan | Sulit menentukan harga, harus bertanya ke tim desain/produksi apakah project selesai, harus menjelaskan ulang output project ke pelanggan, dan harus menginput data berulang jika pelanggan memesan banyak produk |
| Operator/Desainer | Usia 18–40 tahun, bertugas menerima project dari admin, membuat desain, mencetak, finishing, dan menyerahkan hasil project ke admin | Ingin pembagian tugas merata, struktur kerja jelas, komunikasi tim lebih baik, dan pengolahan data lebih efisien | Pekerjaan menumpuk karena tidak dibagi merata, pelanggan belum memiliki gambaran output project yang jelas, deadline tidak masuk akal, data berantakan, dan status project tidak selalu jelas |

## MVP User Stories
| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| US1 | As an admin, I want to create a new customer order so that every incoming order is recorded in the system. | 1. Admin can input customer name, contact, order notes, and deadline. 2. Every order receives a unique order ID. 3. Order status starts from “Order Masuk”. | P0 |
| US2 | As an admin, I want to create one order with multiple order items so that I do not need to input the same customer repeatedly for different products. | 1. Admin can input customer data once. 2. Admin can add more than one item order in one transaction. 3. Each item has product, base price, unit, quantity/size, subtotal, notes, status, and PIC. 4. Total order is calculated from all item subtotals minus discount. | P0 |
| US3 | As an admin, I want to manage customer data so that customer history and contact information are not lost in WhatsApp chats. | 1. Admin can save customer name and contact information. 2. Admin can view customer order history. 3. Admin can search customer data. | P0 |
| US4 | As an admin, I want to calculate prices using product base prices so that price estimation becomes faster and easier. | 1. Admin selects product from product list. 2. System shows base price and unit automatically. 3. Admin inputs quantity/size. 4. System calculates item subtotal using base price x quantity/size. 5. System totals all order items. | P0 |
| US5 | As an admin, I want to add discount or price reduction so that negotiated prices are recorded clearly. | 1. Admin can add discount to the total transaction. 2. Admin can write discount notes. 3. System shows subtotal before discount, discount amount, and final total. | P0 |
| US6 | As an owner or admin, I want to manage product base prices so that the pricing calculator uses valid pricing data. | 1. Owner/admin can view product list. 2. Owner/admin can add new product. 3. Owner/admin can edit base price and unit. 4. Product base price is used automatically in order calculation. | P0 |
| US7 | As an admin, I want to assign order items to design or production teams so that work distribution is clear. | 1. Admin can assign each item order to a specific operator/designer. 2. Assigned user can see the item in their task list. 3. Admin and owner can see who is responsible for each item. | P0 |
| US8 | As an operator/designer, I want to see tasks assigned to me so that I know what project I need to work on. | 1. Operator/designer can view assigned tasks only. 2. Task detail includes product information, customer brief, deadline, status, and notes. 3. Operator/designer can filter tasks by status. | P0 |
| US9 | As an operator/designer, I want to update production status so that admin and owner know the real progress of each item order. | 1. Operator/designer can update status based on allowed workflow. 2. Available statuses include order masuk, menunggu DP, proses desain, menunggu approval pelanggan, siap cetak, proses cetak, finishing, siap diambil, selesai, and dibatalkan. 3. Status changes are visible to admin and owner. | P0 |
| US10 | As an operator/designer, I want to record production or design issues so that project problems are visible and can be followed up. | 1. Operator/designer can add issue notes to an order/item. 2. Admin and owner can view issue notes. 3. Issues can appear in a simple problem report. | P0 |
| US11 | As an admin, I want to record DP and payment status so that unpaid orders can be tracked clearly. | 1. Admin can input DP amount, remaining balance, and payment status. 2. Payment status can be marked as unpaid, partially paid, or fully paid. 3. Owner can view unpaid and partially paid orders. | P0 |
| US12 | As an owner, I want to view a dashboard so that I can monitor the business without asking admin or operator manually. | 1. Dashboard shows total orders, unfinished orders, unpaid orders, daily/monthly revenue, stock overview, and production/design issues. 2. Dashboard data is based on recorded order and payment data. 3. Owner can access all dashboard information. | P0 |
| US13 | As an owner or admin, I want to view simple reports so that business performance can be reviewed daily or monthly. | 1. System provides daily/monthly order report. 2. System provides revenue report. 3. System provides unpaid payment report. 4. System provides unfinished order report. 5. System provides production/design issue report. | P0 |
| US14 | As an owner or admin, I want to manage simple material stock so that the team can know material availability. | 1. Owner and admin can view and edit stock. 2. Operator/designer can only view stock. 3. Operator/designer can add notes if material is almost empty. | P1 |
| US15 | As an owner, I want role-based access control so that every user can only access features related to their responsibility. | 1. Owner can access all data, reports, stock, and edit price. 2. Admin can create order, edit price, edit payment, assign task, and view/edit stock. 3. Operator/designer can view assigned task, update work status, record issues, and view stock. | P0 |
| US16 | As a user, I want to search and filter orders so that I can quickly find the project I need. | 1. Users can filter orders by status. 2. Admin/owner can search by customer, date, order status, and assigned team. 3. Operator/designer can search within assigned tasks. | P0 |

## Functional Requirements
### 1. Order Management
Admin must be able to create and manage customer orders. Each order represents one transaction from one customer. A single order can contain multiple order items.

Required capabilities:
- Create new order.
- Input customer data once per transaction.
- Add multiple item orders under one customer order.
- View order detail.
- Search and filter order by status, customer, date, and assigned team.
- Track order payment status.
- Track item production status.

### 2. Multi-Order Management
The system must support multi-order so that admin does not need to repeat customer input for different products from the same customer.

Concept:
- Order Header: main order data such as customer, contact, deadline, payment, total, and general notes.
- Order Item: product-specific item inside the order, such as banner, poster, kartu nama, or other product.

Example:
```text
Order #ORD-1023
Pelanggan: Andi

- Item 1: Banner 2 meter
- Item 2: Poster full color 10 lembar
- Item 3: Kartu nama 1 box
```

Each item order should have:
- Product name.
- Base price.
- Unit.
- Quantity/size.
- Subtotal.
- Item note/brief.
- PIC/operator/designer.
- Item production status.

### 3. Customer Management
The system must store customer data so admin can reduce repeated manual communication.

Required capabilities:
- Save customer name.
- Save WhatsApp/contact number.
- Save customer notes.
- View customer order history.
- Search customer data.

### 4. Product & Base Price Management
The system must have a product list with base prices.

Required product fields:
- Product name.
- Base price.
- Unit.
- Status active/inactive.

Example product list:
| Produk | Biaya Dasar | Satuan |
|---|---:|---|
| Banner | Rp25.000 | meter |
| Poster full color | Rp5.000 | lembar |
| Kartu nama | Rp50.000 | box |
| Stiker | Rp10.000 | lembar |

Owner/admin must be able to:
- View product list.
- Add product.
- Edit product base price.
- Edit product unit.
- Deactivate product if no longer used.

### 5. Simplified Pricing Calculator
The pricing calculator must be simple and based on product base price.

Formula:
```text
Item subtotal = Product base price x quantity/size
Order subtotal = Sum of all item subtotals
Final total = Order subtotal - discount
```

The calculator should include:
- Product selection.
- Automatic base price display.
- Automatic unit display.
- Quantity/size input.
- Item subtotal.
- Order subtotal.
- Discount/price reduction.
- Discount note.
- Final total.

Fields removed from MVP calculator:
- Material cost.
- Color cost.
- Finishing cost.
- Fast deadline cost.
- Additional cost.

Reason for simplification:
- Admin needs fast input.
- Too many price components can slow down service.
- Product variants can represent price differences.
- Example: Poster BW and poster full color can be separate products with different base prices.

### 6. Discount / Price Reduction
The system must support discount or price reduction to handle price negotiation.

Required capabilities:
- Add discount to total order transaction.
- Add discount notes.
- Show subtotal before discount.
- Show final total after discount.

Example:
```text
Item 1: Banner 2 meter = Rp50.000
Item 2: Poster full color 10 lembar = Rp50.000
Subtotal = Rp100.000
Discount = Rp10.000
Final total = Rp90.000
```

### 7. Order Status Tracking
The system must support these statuses:
- Order masuk.
- Menunggu pembayaran DP.
- Proses desain.
- Menunggu approval pelanggan.
- Siap cetak.
- Proses cetak.
- Finishing.
- Siap diambil.
- Selesai.
- Dibatalkan.

Status tracking should be visible to admin, owner, and assigned operator/designer. In multi-order, each item may have its own production status because different products may be handled by different people or finish at different times.

### 8. Task Assignment
Admin must be able to assign order items to designer/operator.

Required capabilities:
- Assign item order to operator/designer.
- View assigned PIC per item.
- Reassign item if needed.
- Operator/designer can see assigned tasks only.

### 9. Operator/Designer Task List
Operator/designer must have a task list that shows assigned item orders.

Task detail should include:
- Order ID.
- Customer name.
- Product.
- Quantity/size.
- Item notes/brief.
- Deadline.
- Current status.
- Payment warning if relevant.
- Issue notes.

### 10. Production/Design Issue Notes
The system must allow operator/designer to record project issues.

Examples of issue types:
- Customer brief unclear.
- File design not ready.
- Material almost empty.
- Machine problem.
- Deadline too fast.
- Too many revisions.
- Finishing issue.

Required capabilities:
- Add issue note to order or item.
- View issue notes in order detail.
- Show issue notes in owner/admin report.

### 11. Payment Management
The system must track DP and payment status.

Required payment fields:
- Total order.
- DP amount.
- Remaining payment.
- Payment status: unpaid, partially paid, fully paid.
- Payment notes.

Required capabilities:
- Admin can record DP.
- Admin can update payment.
- Owner can view unpaid orders.
- Payment data appears in reports.

### 12. Dashboard Owner
The owner dashboard should show:
- Total orders today/month.
- Orders in progress.
- Orders completed.
- Orders not yet paid.
- Daily/monthly revenue.
- Production/design issues.
- Simple stock overview.

Dashboard goal:
- Owner can understand business condition without asking admin/operator manually.

### 13. Simple Reports
Reports required for MVP:
- Daily order report.
- Monthly order report.
- Revenue report.
- Unpaid payment report.
- Unfinished order report.
- Production/design issue report.

Reports should help the owner understand business condition and operational bottlenecks.

### 14. Simple Stock Management
For MVP, stock management should remain simple.

Required capabilities:
- Owner/admin can view and edit stock.
- Operator/designer can view stock.
- Operator/designer can add low-stock notes.

Out of scope for MVP stock:
- Supplier management.
- Purchase history.
- Stock valuation.
- Automatic stock deduction.
- Complex inventory accounting.

### 15. Role-Based Access Control
The system must support three internal roles:
- Owner.
- Admin.
- Operator/designer.

Access rules:
| Feature | Owner | Admin | Operator/Designer |
|---|---|---|---|
| View all orders | Yes | Yes | No, assigned only |
| Create order | Optional | Yes | No |
| Edit product price | Yes | Yes | No |
| Add discount | Yes | Yes | No |
| Edit payment | Yes | Yes | No |
| Assign task | Yes | Yes | No |
| Update production status | Yes | Yes | Assigned only |
| View reports | Yes | Limited/optional | No |
| View stock | Yes | Yes | Yes |
| Edit stock | Yes | Yes | No |
| Add low-stock note | Yes | Yes | Yes |

### 16. Core User Flows
#### 16.1 Main Order Flow
```text
Pelanggan WhatsApp / Datang Langsung
    ↓
Admin Buat Order
    ↓
Input Data Pelanggan Sekali
    ↓
Tambah Satu atau Banyak Item Order
    ↓
Pilih Produk dan Hitung Harga per Item
    ↓
Sistem Menjumlahkan Semua Item
    ↓
Input Diskon jika Ada
    ↓
Input DP / Status Pembayaran
    ↓
Assign Item ke Operator/Desainer
    ↓
Operator/Desainer Mengerjakan Tugas
    ↓
Update Status Produksi
    ↓
Finishing
    ↓
Siap Diambil
    ↓
Pelunasan / Selesai
```

#### 16.2 Admin Create Multi-Order Flow
```text
Admin Login
    ↓
Klik Buat Order
    ↓
Input Data Pelanggan
    ↓
Input Catatan Umum / Deadline
    ↓
Tambah Item Order Pertama
    ↓
Pilih Produk
    ↓
Harga Dasar dan Satuan Muncul Otomatis
    ↓
Input Jumlah / Ukuran
    ↓
Subtotal Item Terhitung
    ↓
Tambah Item Berikutnya jika Ada
    ↓
Sistem Menjumlahkan Semua Item
    ↓
Input Diskon / Catatan Diskon
    ↓
Input DP / Status Bayar
    ↓
Assign Item ke Operator/Desainer
    ↓
Simpan Order
```

#### 16.3 Operator Work Flow
```text
Operator Login
    ↓
Buka Tugas Saya
    ↓
Pilih Item Project
    ↓
Baca Detail Brief
    ↓
Kerjakan Desain / Produksi
    ↓
Update Status
    ↓
Tambahkan Catatan Masalah jika Ada
    ↓
Simpan Update
```

#### 16.4 Owner Monitoring Flow
```text
Owner Login
    ↓
Buka Dashboard
    ↓
Lihat Total Order
    ↓
Lihat Order Belum Selesai
    ↓
Lihat Pembayaran Belum Lunas
    ↓
Lihat Masalah Produksi/Desain
    ↓
Buka Laporan Harian/Bulanan
```



## Non-Functional Requirements
- Performance: The system should comfortably support around 23 internal users consisting of 1 owner, 2 admins, and 20 operators/designers. The system should support approximately 20–100 orders per day. Frequently used pages such as order list, order detail, dashboard, product list, and task list should load quickly enough to not interrupt daily work.
- Security: The system must have login and role-based access control. Sensitive data such as pricing, discount, payment, revenue report, product base price, and stock changes must only be editable by authorized users. Operator/designer should not be able to edit price, payment, product pricing, or financial reports. Important changes such as price edit, discount, payment update, product base price edit, and stock edit should have change history.
- Scalability: MVP should focus on one internal percetakan operation first. The system structure should allow future expansion into customer portal, automatic invoice, barcode tracking, advanced inventory, and multi-branch features.
- Reliability: Order, item status, payment, production status, issue notes, product prices, and stock data should not be easily lost. Users should be able to search and filter data when order volume increases. Admin/owner should be able to correct wrong input based on role permission.
- Usability: The system must be user friendly. Admin should be able to create multi-order without confusing steps. Operator/designer should easily see assigned tasks. Owner should understand dashboard and reports without opening too many menus.
- Data Accuracy: Pricing, discount, payment, and order status must be recorded clearly so reports remain valid. Discount or price reduction must be visible in calculation history to avoid confusion between subtotal and final negotiated price.

## Success Metrics
- North Star Metric: Percentage of orders successfully managed from order entry to completion without being lost or unclear.

- Supporting Metrics:
  - Number of orders recorded per day/month.
  - Percentage of orders with complete customer and item data.
  - Average time needed by admin to create a multi-order.
  - Average number of items per order.
  - Percentage of order items with updated status.
  - Number of unpaid or partially paid orders successfully tracked.
  - Number of unfinished orders visible in the system.
  - Number of production/design issues recorded.
  - Time needed by owner to view daily business report.
  - Number of tasks assigned to operator/designer.
  - Percentage of products with valid base price.
  - User friendliness score from owner, admin, and operator/designer feedback.

## MVP Scope & Out of Scope
**In Scope (MVP)**
- Internal user login and role access.
- Order input and order management.
- Multi-order: one customer order can contain multiple order items.
- Customer data management.
- Product list and base price management.
- Simplified pricing calculator using product base price x quantity/size.
- Discount or price reduction on total transaction.
- Order/item status tracking.
- Task assignment to design/production team per item.
- Operator/designer task list.
- Production/design issue notes.
- DP and payment status tracking.
- Owner dashboard.
- Simple reports for orders, revenue, unpaid payments, unfinished orders, and production/design issues.
- Simple stock visibility and basic stock editing for owner/admin.
- Low-stock notes from operator/designer.
- Search and filter orders.

**Out of Scope (V2)**
- Customer portal.
- Automatic invoice generation.
- Barcode order generated into invoice.
- WhatsApp automatic notification.
- Advanced inventory management.
- Supplier management.
- Purchase history.
- Stock valuation.
- Automatic stock deduction.
- Employee attendance.
- Payroll or commission management.
- Multi-branch management.
- Customer self-service order tracking.
- Online payment integration.
- Complex pricing formula with material cost, color cost, finishing cost, fast deadline cost, and additional cost.

## Open Questions & Risks
- Open Question: Apakah semua produk cukup dihitung dengan rumus biaya dasar x jumlah/ukuran, atau ada produk tertentu yang butuh formula khusus?
- Open Question: Apakah discount cukup diterapkan ke total transaksi, atau perlu juga discount per item order?
- Open Question: Apakah setiap item order wajib punya status produksi sendiri, atau cukup status utama di level order untuk MVP?
- Open Question: Apakah approval desain dari pelanggan tetap dilakukan di WhatsApp pada MVP, atau perlu dicatat juga di sistem?
- Open Question: Apakah file desain perlu diunggah ke sistem pada MVP, atau cukup menggunakan catatan/link file eksternal?
- Open Question: Apakah laporan perlu bisa diekspor ke Excel/PDF pada MVP?
- Risk: Scope MVP bisa melebar jika portal pelanggan, invoice otomatis, barcode, absensi, dan stok advanced dimasukkan terlalu awal.
- Risk: Multi-order bisa membuat status lebih kompleks jika setiap item memiliki PIC dan status berbeda.
- Risk: Kalkulator harga terlalu sederhana mungkin tidak cocok untuk semua produk jika ada produk yang membutuhkan perhitungan khusus.
- Risk: Data laporan bisa tidak akurat jika admin tidak konsisten mencatat pembayaran, diskon, atau status order.
- Risk: Operator/desainer mungkin tidak disiplin update status jika proses update terlalu rumit.
- Risk: Stok bahan bisa menjadi tidak valid jika tidak ada aturan jelas siapa yang mengubah stok dan kapan stok diperbarui.
