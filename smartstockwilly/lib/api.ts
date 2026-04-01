export type ClientStatus = "Ativo" | "Inativo"

export interface Client {
  id: string
  name: string
  cpfCnpj: string
  phone: string
  email: string
  city: string
  status: ClientStatus
  createdAt: string
}

export type ProductStatus = "Ativo" | "Inativo"

export interface Product {
  id: string
  name: string
  type: string
  code: string
  ref: string
  stock: number
  unit: string
  price: number
  status: ProductStatus
  createdAt: string
}

export type OrderStatus = "Orcamento" | "Pendente" | "Faturado" | "Cancelado" | "Entregue"

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
}

export interface Order {
  id: string
  number: string
  date: string
  clientId: string
  status: OrderStatus
  total: number
  items: OrderItem[]
}

export type DeliveryStatus = "Pendente" | "Em rota" | "Entregue" | "Cancelada"

export interface Delivery {
  id: string
  orderId: string
  clientId: string
  city: string
  status: DeliveryStatus
  scheduledDate: string
}

export type StockMovementType = "Entrada" | "Saida"

export interface StockMovement {
  id: string
  date: string
  productId: string
  type: StockMovementType
  quantity: number
  origin: string
  stockAfter: number
}

export interface UserSession {
  isLoggedIn: boolean
  userName: string
}

export interface NewClientInput {
  name: string
  cpfCnpj: string
  phone: string
  email: string
  city: string
}

export interface NewProductInput {
  name: string
  type: string
  code: string
  ref: string
  stock: number
  unit: string
  price: number
}

export interface Supplier {
  id: string
  name: string
  cpfCnpj: string
  phone: string
  email: string
  city: string
  status: "Ativo" | "Inativo"
  createdAt: string
}

export interface NewSupplierInput {
  name: string
  cpfCnpj: string
  phone: string
  email: string
  city: string
}

export interface StockLocation {
  id: string
  name: string
  address: string
  products: number
  status: "Ativo" | "Inativo"
  createdAt: string
}

export interface NewStockLocationInput {
  name: string
  address: string
  products: number
}

export interface NewStockMovementInput {
  productId: string
  type: StockMovementType
  quantity: number
  origin: string
}

export interface NewOrderItemInput {
  productId: string
  quantity: number
  unitPrice: number
  discount: number
}

export interface NewOrderInput {
  clientId: string
  items: NewOrderItemInput[]
  status?: OrderStatus
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081/api"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function getSession(): Promise<UserSession | null> {
  if (typeof window === "undefined") return null
  const raw = window.sessionStorage.getItem("SMARTSTOCK_SESSION")
  return raw ? (JSON.parse(raw) as UserSession) : null
}

export async function setSession(session: UserSession | null) {
  if (typeof window === "undefined") return
  if (!session) {
    window.sessionStorage.removeItem("SMARTSTOCK_SESSION")
    return
  }
  window.sessionStorage.setItem("SMARTSTOCK_SESSION", JSON.stringify(session))
}

export async function listClients(): Promise<Client[]> {
  return request<Client[]>("/clients")
}

export async function addClient(input: NewClientInput): Promise<Client> {
  return request<Client>("/clients", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function listProducts(): Promise<Product[]> {
  return request<Product[]>("/products")
}

export async function addProduct(input: NewProductInput): Promise<Product> {
  return request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function listSuppliers(): Promise<Supplier[]> {
  return request<Supplier[]>("/suppliers")
}

export async function addSupplier(input: NewSupplierInput): Promise<Supplier> {
  return request<Supplier>("/suppliers", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function listStockLocations(): Promise<StockLocation[]> {
  return request<StockLocation[]>("/stock-locations")
}

export async function addStockLocation(input: NewStockLocationInput): Promise<StockLocation> {
  return request<StockLocation>("/stock-locations", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function listStockMovements(): Promise<StockMovement[]> {
  return request<StockMovement[]>("/stock-movements")
}

export async function addStockMovement(input: NewStockMovementInput): Promise<StockMovement> {
  return request<StockMovement>("/stock-movements", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function listOrders(): Promise<Order[]> {
  return request<Order[]>("/orders")
}

export async function createOrder(input: NewOrderInput): Promise<Order> {
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  return request<Order>(`/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

export async function listDeliveries(): Promise<Delivery[]> {
  return request<Delivery[]>("/deliveries")
}

export async function updateDeliveryStatus(deliveryId: string, status: DeliveryStatus): Promise<Delivery> {
  return request<Delivery>(`/deliveries/${deliveryId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

export interface DashboardSummary {
  ordersCount: number
  pendingOrders: number
  totalRevenue: number
  totalStock: number
  clientsCount: number
  productsCount: number
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>("/dashboard/summary")
}
